import { Router, Request, Response } from 'express';
import { projects } from '../data/projects';
import { projectActivityHistory } from '../data/activity';
import { issues } from '../data/issues';
import { securityHotspots } from '../data/securityHotspots';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { search, qualityGate, language, page = '1', pageSize = '10' } = req.query;
  let filtered = [...projects];

  if (search && typeof search === 'string') {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(term) || p.key.toLowerCase().includes(term)
    );
  }

  if (qualityGate && typeof qualityGate === 'string') {
    filtered = filtered.filter((p) => p.qualityGate === qualityGate);
  }

  if (language && typeof language === 'string') {
    filtered = filtered.filter((p) => p.language.toLowerCase() === language.toLowerCase());
  }

  const total = filtered.length;
  const p = parseInt(page as string, 10);
  const ps = parseInt(pageSize as string, 10);
  const start = (p - 1) * ps;
  const paged = filtered.slice(start, start + ps);

  res.json({ data: paged, total, page: p, pageSize: ps });
});

router.get('/:key', (req: Request, res: Response) => {
  const project = projects.find((p) => p.key === req.params.key);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ data: project });
});

router.get('/:key/issues', (req: Request, res: Response) => {
  const projectIssues = issues.filter((i) => i.project === req.params.key);
  res.json({ data: projectIssues, total: projectIssues.length });
});

router.get('/:key/hotspots', (req: Request, res: Response) => {
  const projectHotspots = securityHotspots.filter((h) => h.project === req.params.key);
  res.json({ data: projectHotspots, total: projectHotspots.length });
});

router.get('/:key/activity', (req: Request, res: Response) => {
  const history = projectActivityHistory[req.params.key] || [];
  res.json({ data: history });
});

export default router;
