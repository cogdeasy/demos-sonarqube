import { Router, Request, Response } from 'express';
import { projects } from '../data/projects';
import { issues } from '../data/issues';
import { securityHotspots } from '../data/securityHotspots';

const router = Router();

router.get('/overview', (_req: Request, res: Response) => {
  const totalProjects = projects.length;
  const totalLinesOfCode = projects.reduce((sum, p) => sum + p.metrics.linesOfCode, 0);
  const totalBugs = projects.reduce((sum, p) => sum + p.metrics.bugs, 0);
  const totalVulnerabilities = projects.reduce((sum, p) => sum + p.metrics.vulnerabilities, 0);
  const totalCodeSmells = projects.reduce((sum, p) => sum + p.metrics.codeSmells, 0);
  const totalSecurityHotspots = projects.reduce((sum, p) => sum + p.metrics.securityHotspots, 0);
  const avgCoverage = projects.reduce((sum, p) => sum + p.metrics.coverage, 0) / totalProjects;
  const avgDuplications = projects.reduce((sum, p) => sum + p.metrics.duplications, 0) / totalProjects;

  const openIssues = issues.filter(
    (i) => i.status === 'OPEN' || i.status === 'CONFIRMED' || i.status === 'REOPENED'
  );

  const qualityGateDistribution = {
    OK: projects.filter((p) => p.qualityGate === 'OK').length,
    WARN: projects.filter((p) => p.qualityGate === 'WARN').length,
    ERROR: projects.filter((p) => p.qualityGate === 'ERROR').length,
  };

  const languageDistribution: Record<string, { projects: number; lines: number }> = {};
  projects.forEach((p) => {
    if (!languageDistribution[p.language]) {
      languageDistribution[p.language] = { projects: 0, lines: 0 };
    }
    languageDistribution[p.language].projects++;
    languageDistribution[p.language].lines += p.metrics.linesOfCode;
  });

  const ratingDistribution = {
    reliability: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    security: { A: 0, B: 0, C: 0, D: 0, E: 0 },
    maintainability: { A: 0, B: 0, C: 0, D: 0, E: 0 },
  };
  projects.forEach((p) => {
    ratingDistribution.reliability[p.metrics.reliabilityRating]++;
    ratingDistribution.security[p.metrics.securityRating]++;
    ratingDistribution.maintainability[p.metrics.maintainabilityRating]++;
  });

  const hotspotsByStatus = {
    toReview: securityHotspots.filter((h) => h.status === 'TO_REVIEW').length,
    reviewed: securityHotspots.filter((h) => h.status === 'REVIEWED').length,
    safe: securityHotspots.filter((h) => h.status === 'SAFE').length,
    fixed: securityHotspots.filter((h) => h.status === 'FIXED').length,
  };

  res.json({
    data: {
      totalProjects,
      totalLinesOfCode,
      totalBugs,
      totalVulnerabilities,
      totalCodeSmells,
      totalSecurityHotspots,
      avgCoverage: Math.round(avgCoverage * 10) / 10,
      avgDuplications: Math.round(avgDuplications * 10) / 10,
      openIssues: openIssues.length,
      qualityGateDistribution,
      languageDistribution,
      ratingDistribution,
      hotspotsByStatus,
    },
  });
});

export default router;
