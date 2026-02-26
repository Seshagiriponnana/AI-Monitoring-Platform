import { Octokit } from '@octokit/rest';
import { logger } from '../utils/logger';
import type { FileContent, RepoMetadata } from '../types';

const CODE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.rb', '.go', '.rs', '.java', '.kt', '.swift',
  '.c', '.cpp', '.cc', '.h', '.hpp',
  '.cs', '.fs', '.php', '.scala', '.r',
  '.vue', '.svelte', '.astro',
  '.css', '.scss', '.sass', '.less',
  '.html', '.htm',
  '.sql', '.graphql', '.proto',
  '.sh', '.bash', '.zsh',
  '.yaml', '.yml', '.json', '.toml', '.env.example',
  '.md', '.mdx',
]);

const CI_FILES = [
  '.github/workflows', '.travis.yml', '.circleci', 'Jenkinsfile',
  '.gitlab-ci.yml', 'azure-pipelines.yml', 'bitbucket-pipelines.yml'
];

const IGNORE_DIRS = new Set([
  'node_modules', 'dist', 'build', '.next', '.nuxt', '__pycache__',
  '.git', 'vendor', 'target', 'out', 'coverage', '.cache', 'venv',
  'env', '.venv', 'eggs', '.eggs', 'bower_components', 'jspm_packages'
]);

const MAX_FILES = 50;
const MAX_FILE_SIZE = 80_000; // 80KB per file
const MAX_TOTAL_CHARS = 300_000;

function detectLanguage(filePath: string): string {
  const ext = '.' + filePath.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    '.ts': 'TypeScript', '.tsx': 'TypeScript/React', '.js': 'JavaScript',
    '.jsx': 'JavaScript/React', '.py': 'Python', '.rb': 'Ruby',
    '.go': 'Go', '.rs': 'Rust', '.java': 'Java', '.kt': 'Kotlin',
    '.swift': 'Swift', '.c': 'C', '.cpp': 'C++', '.cs': 'C#',
    '.php': 'PHP', '.scala': 'Scala', '.vue': 'Vue', '.svelte': 'Svelte',
    '.css': 'CSS', '.scss': 'SCSS', '.html': 'HTML', '.sql': 'SQL',
    '.yaml': 'YAML', '.yml': 'YAML', '.json': 'JSON', '.md': 'Markdown',
    '.sh': 'Shell', '.graphql': 'GraphQL', '.proto': 'Protobuf',
  };
  return langMap[ext] || 'Unknown';
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const cleaned = url.replace(/\.git$/, '').trim();
    const patterns = [
      /github\.com[/:]([\w.-]+)\/([\w.-]+)/,
    ];
    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchRepoMetadata(repoUrl: string): Promise<RepoMetadata> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) throw new Error('Invalid GitHub repository URL');

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || undefined });

  const { data } = await octokit.repos.get({ owner: parsed.owner, repo: parsed.repo });

  // Check for README
  let hasReadme = false;
  try {
    await octokit.repos.getReadme({ owner: parsed.owner, repo: parsed.repo });
    hasReadme = true;
  } catch { /* no readme */ }

  // Check for CI
  let hasCI = false;
  try {
    const { data: tree } = await octokit.git.getTree({
      owner: parsed.owner, repo: parsed.repo,
      tree_sha: data.default_branch, recursive: '1'
    });
    hasCI = tree.tree.some(f => CI_FILES.some(ci => f.path?.includes(ci)));
  } catch { /* ignore */ }

  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    language: data.language,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at ?? new Date().toISOString(),
    defaultBranch: data.default_branch,
    topics: data.topics ?? [],
    license: data.license?.name ?? null,
    hasTests: false, // updated during file fetch
    hasReadme,
    hasCI,
  };
}

export async function fetchRepoFiles(
  repoUrl: string,
  branch?: string
): Promise<{ files: FileContent[]; metadata: RepoMetadata }> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) throw new Error('Invalid GitHub repository URL');

  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || undefined });
  logger.info(`Fetching repo: ${parsed.owner}/${parsed.repo}`);

  const metadata = await fetchRepoMetadata(repoUrl);
  const targetBranch = branch || metadata.defaultBranch;

  // Get full tree
  const { data: treeData } = await octokit.git.getTree({
    owner: parsed.owner,
    repo: parsed.repo,
    tree_sha: targetBranch,
    recursive: '1',
  });

  if (treeData.truncated) {
    logger.warn('Repository tree was truncated due to size');
  }

  // Filter relevant files
  const codeFiles = treeData.tree.filter(item => {
    if (item.type !== 'blob' || !item.path) return false;
    const parts = item.path.split('/');
    if (parts.some(p => IGNORE_DIRS.has(p))) return false;
    const ext = '.' + item.path.split('.').pop()?.toLowerCase();
    return CODE_EXTENSIONS.has(ext);
  });

  // Check for tests
  const hasTests = codeFiles.some(f =>
    f.path?.includes('test') || f.path?.includes('spec') || f.path?.includes('__tests__')
  );
  metadata.hasTests = hasTests;

  // Priority: entry points, configs, main files first
  const prioritized = [...codeFiles].sort((a, b) => {
    const priority = (p: string) => {
      if (p.includes('main') || p.includes('index') || p.includes('app')) return 0;
      if (p.includes('config') || p.includes('setup')) return 1;
      if (p.match(/\.(ts|js|py|go|rs|java)$/) && !p.includes('/')) return 2;
      return 3;
    };
    return priority(a.path ?? '') - priority(b.path ?? '');
  });

  const selectedFiles = prioritized.slice(0, MAX_FILES);
  const files: FileContent[] = [];
  let totalChars = 0;

  // Fetch file contents with concurrency limit
  const CONCURRENCY = 5;
  for (let i = 0; i < selectedFiles.length && totalChars < MAX_TOTAL_CHARS; i += CONCURRENCY) {
    const batch = selectedFiles.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async (file) => {
        if (!file.path) return null;
        try {
          const { data } = await octokit.repos.getContent({
            owner: parsed.owner,
            repo: parsed.repo,
            path: file.path,
            ref: targetBranch,
          });
          if (Array.isArray(data) || data.type !== 'file') return null;
          const content = Buffer.from(data.content, 'base64').toString('utf-8');
          if (content.length > MAX_FILE_SIZE) return null;
          return {
            path: file.path,
            content: content.slice(0, MAX_FILE_SIZE),
            language: detectLanguage(file.path),
            size: data.size,
          } satisfies FileContent;
        } catch {
          return null;
        }
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        totalChars += result.value.content.length;
        files.push(result.value);
        if (totalChars >= MAX_TOTAL_CHARS) break;
      }
    }
  }

  logger.info(`Fetched ${files.length} files, ${Math.round(totalChars / 1000)}KB total`);
  return { files, metadata };
}
