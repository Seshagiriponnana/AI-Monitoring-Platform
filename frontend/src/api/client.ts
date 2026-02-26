import axios from 'axios';
import type { ApiResponse, AnalysisReport } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 120_000, // 2 minutes for large repos
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export async function analyzeRepository(
  repoUrl: string,
  branch?: string,
  onProgress?: (stage: string) => void
): Promise<AnalysisReport> {
  onProgress?.('Fetching repository files...');

  const { data } = await apiClient.post<ApiResponse<AnalysisReport>>('/analyze', {
    repoUrl,
    branch: branch || undefined,
    includeTests: true,
  });

  if (!data.success || !data.data) {
    throw new Error(data.error || 'Analysis failed');
  }

  onProgress?.('Analysis complete!');
  return data.data;
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    await apiClient.get('/analyze/health');
    return true;
  } catch {
    return false;
  }
}
