import Groq from 'groq-sdk';
import { logger } from '../utils/logger';
import type { FileContent, RepoMetadata, AnalysisReport } from '../types';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

function buildAnalysisPrompt(files: FileContent[], metadata: RepoMetadata): string {
  const filesSummary = files.map(f =>
    `### File: ${f.path} (${f.language})\n\`\`\`\n${f.content}\n\`\`\``
  ).join('\n\n');

  return `You are an expert senior software engineer and security auditor. Analyze this GitHub repository and return a detailed JSON report.

## Repository Information
- Name: ${metadata.fullName}
- Description: ${metadata.description || 'No description'}
- Primary Language: ${metadata.language || 'Unknown'}
- Stars: ${metadata.stars} | Forks: ${metadata.forks}
- Has README: ${metadata.hasReadme} | Has Tests: ${metadata.hasTests} | Has CI/CD: ${metadata.hasCI}
- License: ${metadata.license || 'None'}
- Topics: ${metadata.topics.join(', ') || 'None'}

## Code Files (${files.length} files analyzed)
${filesSummary}

## Instructions
Return ONLY a valid JSON object. No markdown. No explanation. No code fences. Just raw JSON.

{
  "overallScore": 75,
  "grade": "B",
  "summary": "2-3 sentence summary here",
  "strengths": ["strength1", "strength2", "strength3"],
  "criticalIssues": ["issue1", "issue2"],
  "scores": {
    "codeQuality": 75,
    "security": 70,
    "industryStandards": 80,
    "maintainability": 72,
    "documentation": 65,
    "testing": 60
  },
  "codeQuality": {
    "score": 75,
    "issues": [
      {
        "type": "warning",
        "category": "Error Handling",
        "title": "Missing error handling",
        "description": "Detailed description",
        "file": "src/index.ts",
        "recommendation": "Add try-catch blocks"
      }
    ],
    "positives": ["positive1", "positive2"]
  },
  "security": {
    "score": 70,
    "riskLevel": "medium",
    "vulnerabilities": [
      {
        "severity": "medium",
        "title": "Vulnerability title",
        "description": "Detailed description",
        "file": "optional file",
        "recommendation": "Fix recommendation",
        "cwe": "CWE-79"
      }
    ],
    "passedChecks": ["check1", "check2"]
  },
  "industryStandards": {
    "score": 80,
    "standards": [
      {
        "standard": "SOLID Principles",
        "status": "partial",
        "description": "Description here",
        "impact": "Impact here"
      }
    ],
    "frameworks": ["Express", "TypeScript"],
    "patterns": ["MVC", "Repository Pattern"]
  },
  "metrics": {
    "estimatedLinesOfCode": 1500,
    "fileCount": ${files.length},
    "languageBreakdown": {"TypeScript": 80, "JavaScript": 20},
    "complexityScore": 45,
    "maintainabilityIndex": 72,
    "documentationCoverage": 40,
    "testCoverage": "poor",
    "codeSmells": 5,
    "duplicateCodeRisk": "low"
  },
  "keyConcepts": ["REST API", "TypeScript", "Node.js"],
  "learningRecommendations": [
    {
      "priority": "high",
      "topic": "Topic name",
      "description": "Why this is important",
      "resources": ["https://resource1.com", "https://resource2.com"]
    }
  ],
  "architectureInsights": "2-3 sentences about architecture",
  "performanceNotes": ["note1", "note2"]
}

Replace the example values above with your REAL analysis of the actual code provided. Be specific and reference actual file names.`;
}

function calculateGrade(score: number): AnalysisReport['grade'] {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export async function analyzeRepository(
  files: FileContent[],
  metadata: RepoMetadata
): Promise<AnalysisReport> {
  logger.info(`Starting Groq analysis for ${metadata.fullName}`);

  const prompt = buildAnalysisPrompt(files, metadata);

  try {
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 8192,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer. Always respond with valid JSON only. No markdown, no explanation, no code fences, just raw JSON object.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content || '';
    logger.debug(`Raw response length: ${responseText.length} chars`);

    // Strip accidental markdown fences
    const cleaned = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON found in AI response');

    const parsed = JSON.parse(jsonMatch[0]);
    parsed.grade = calculateGrade(parsed.overallScore);

    const report: AnalysisReport = {
      ...parsed,
      repoMetadata: metadata,
      generatedAt: new Date().toISOString(),
      analysisVersion: '1.0.0',
    };

    logger.info(`Analysis complete. Overall score: ${report.overallScore}`);
    return report;
  } catch (error) {
    logger.error('Groq analysis failed:', error);
    throw new Error(
      `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}