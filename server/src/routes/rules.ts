import { Router, Request, Response } from 'express';
import { rules } from '../data/rules';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { type, severity, language, search, page = '1', pageSize = '10' } = req.query;

  let filtered = [...rules];

  if (type && typeof type === 'string') {
    const types = type.split(',');
    filtered = filtered.filter((r) => types.includes(r.type));
  }

  if (severity && typeof severity === 'string') {
    const severities = severity.split(',');
    filtered = filtered.filter((r) => severities.includes(r.severity));
  }

  if (language && typeof language === 'string') {
    filtered = filtered.filter((r) => r.language === language || r.languageName.toLowerCase() === language.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.key.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
    );
  }

  const total = filtered.length;
  const p = parseInt(page as string, 10);
  const ps = parseInt(pageSize as string, 10);
  const start = (p - 1) * ps;
  const paged = filtered.slice(start, start + ps);

  res.json({ data: paged, total, page: p, pageSize: ps });
});

router.get('/:key', (req: Request, res: Response) => {
  const rule = rules.find((r) => r.key === req.params.key);
  if (!rule) {
    res.status(404).json({ error: 'Rule not found' });
    return;
  }
  res.json({ data: rule });
});

export default router;
