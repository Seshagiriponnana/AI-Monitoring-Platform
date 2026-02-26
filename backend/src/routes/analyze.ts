import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { fetchRepoFiles } from '../services/github';
import { analyzeRepository } from '../services/analyzer';
import { logger } from '../utils/logger';
import type { ApiResponse, AnalysisReport } from '../types';

const router = Router();

const analyzeSchema = z.object({
  repoUrl: z
    .string()
    .url('Must be a valid URL')
    .refine(url => url.includes('github.com'), 'Must be a GitHub repository URL'),
  branch: z.string().optional(),
  includeTests: z.boolean().optional().default(true),
});

// POST /api/analyze
router.post('/', async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    // Validate input
    const validation = analyzeSchema.safeParse(req.body);
    if (!validation.success) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Validation failed',
        message: validation.error.errors.map(e => e.message).join(', '),
      };
      return res.status(400).json(response);
    }

    const { repoUrl, branch } = validation.data;
    logger.info(`Analysis requested for: ${repoUrl}`);

    // Fetch repository files
    const { files, metadata } = await fetchRepoFiles(repoUrl, branch);

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No analyzable code files found in the repository',
      } satisfies ApiResponse<null>);
    }

    // Run AI analysis
    const report = await analyzeRepository(files, metadata);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(`Analysis completed in ${duration}s for ${metadata.fullName}`);

    const response: ApiResponse<AnalysisReport> = {
      success: true,
      data: report,
      message: `Analysis completed in ${duration}s`,
    };

    return res.status(200).json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    logger.error('Analysis endpoint error:', error);

    const statusCode =
      message.includes('Invalid GitHub') || message.includes('Not Found') ? 400
      : message.includes('rate limit') ? 429
      : 500;

    return res.status(statusCode).json({
      success: false,
      error: message,
    } satisfies ApiResponse<null>);
  }
});

// GET /api/analyze/health
router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
