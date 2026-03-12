import { Router, Request, Response } from 'express';
import { securityHotspots } from '../data/securityHotspots';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { status, vulnerabilityProbability, project, page = '1', pageSize = '10' } = req.query;

  let filtered = [...securityHotspots];

  if (status && typeof status === 'string') {
    const statuses = status.split(',');
    filtered = filtered.filter((h) => statuses.includes(h.status));
  }

  if (vulnerabilityProbability && typeof vulnerabilityProbability === 'string') {
    const probs = vulnerabilityProbability.split(',');
    filtered = filtered.filter((h) => probs.includes(h.vulnerabilityProbability));
  }

  if (project && typeof project === 'string') {
    filtered = filtered.filter((h) => h.project === project);
  }

  const total = filtered.length;
  const p = parseInt(page as string, 10);
  const ps = parseInt(pageSize as string, 10);
  const start = (p - 1) * ps;
  const paged = filtered.slice(start, start + ps);

  res.json({ data: paged, total, page: p, pageSize: ps });
});

router.get('/summary', (_req: Request, res: Response) => {
  const summary = {
    total: securityHotspots.length,
    toReview: securityHotspots.filter((h) => h.status === 'TO_REVIEW').length,
    reviewed: securityHotspots.filter((h) => h.status === 'REVIEWED').length,
    safe: securityHotspots.filter((h) => h.status === 'SAFE').length,
    fixed: securityHotspots.filter((h) => h.status === 'FIXED').length,
    byProbability: {
      HIGH: securityHotspots.filter((h) => h.vulnerabilityProbability === 'HIGH').length,
      MEDIUM: securityHotspots.filter((h) => h.vulnerabilityProbability === 'MEDIUM').length,
      LOW: securityHotspots.filter((h) => h.vulnerabilityProbability === 'LOW').length,
    },
    byCategory: {} as Record<string, number>,
  };

  securityHotspots.forEach((h) => {
    if (!summary.byCategory[h.securityCategory]) {
      summary.byCategory[h.securityCategory] = 0;
    }
    summary.byCategory[h.securityCategory]++;
  });

  res.json({ data: summary });
});

export default router;
