export interface AnalysisRequest {
  repoUrl: string;
  branch?: string;
  includeTests?: boolean;
}

export interface FileContent {
  path: string;
  content: string;
  language: string;
  size: number;
}

export interface RepoMetadata {
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string;
  updatedAt: string;
  defaultBranch: string;
  topics: string[];
  license: string | null;
  hasTests: boolean;
  hasReadme: boolean;
  hasCI: boolean;
}

export interface SecurityVulnerability {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  file?: string;
  line?: number;
  recommendation: string;
  cwe?: string;
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'info' | 'suggestion';
  category: string;
  title: string;
  description: string;
  file?: string;
  recommendation: string;
}

export interface IndustryStandard {
  standard: string;
  status: 'followed' | 'partial' | 'violated';
  description: string;
  impact: string;
}

export interface LearningRecommendation {
  priority: 'high' | 'medium' | 'low';
  topic: string;
  description: string;
  resources: string[];
}

export interface CodeMetrics {
  estimatedLinesOfCode: number;
  fileCount: number;
  languageBreakdown: Record<string, number>;
  complexityScore: number;
  maintainabilityIndex: number;
  documentationCoverage: number;
  testCoverage: 'excellent' | 'good' | 'fair' | 'poor' | 'none';
  codeSmells: number;
  duplicateCodeRisk: 'low' | 'medium' | 'high';
}

export interface AnalysisReport {
  repoMetadata: RepoMetadata;
  generatedAt: string;
  analysisVersion: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  summary: string;
  strengths: string[];
  criticalIssues: string[];
  scores: {
    codeQuality: number;
    security: number;
    industryStandards: number;
    maintainability: number;
    documentation: number;
    testing: number;
  };
  codeQuality: {
    score: number;
    issues: CodeIssue[];
    positives: string[];
  };
  security: {
    score: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
    vulnerabilities: SecurityVulnerability[];
    passedChecks: string[];
  };
  industryStandards: {
    score: number;
    standards: IndustryStandard[];
    frameworks: string[];
    patterns: string[];
  };
  metrics: CodeMetrics;
  keyConcepts: string[];
  learningRecommendations: LearningRecommendation[];
  architectureInsights: string;
  performanceNotes: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
