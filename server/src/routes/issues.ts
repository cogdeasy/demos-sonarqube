import { Router, Request, Response } from 'express';
import { issues } from '../data/issues';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const {
    type,
    severity,
    status,
    project,
    language,
    search,
    page = '1',
    pageSize = '10',
  } = req.query;

  let filtered = [...issues];

  if (type && typeof type === 'string') {
    const types = type.split(',');
    filtered = filtered.filter((i) => types.includes(i.type));
  }

  if (severity && typeof severity === 'string') {
    const severities = severity.split(',');
    filtered = filtered.filter((i) => severities.includes(i.severity));
  }

  if (status && typeof status === 'string') {
    const statuses = status.split(',');
    filtered = filtered.filter((i) => statuses.includes(i.status));
  }

  if (project && typeof project === 'string') {
    filtered = filtered.filter((i) => i.project === project);
  }

  if (language && typeof language === 'string') {
    filtered = filtered.filter((i) => i.language.toLowerCase() === language.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.message.toLowerCase().includes(term) ||
        i.rule.toLowerCase().includes(term) ||
        i.component.toLowerCase().includes(term)
    );
  }

  const total = filtered.length;
  const p = parseInt(page as string, 10);
  const ps = parseInt(pageSize as string, 10);
  const start = (p - 1) * ps;
  const paged = filtered.slice(start, start + ps);

  res.json({ data: paged, total, page: p, pageSize: ps });
});

router.get('/summary', (_req: Request, res: Response) => {
  const openIssues = issues.filter((i) => i.status === 'OPEN' || i.status === 'CONFIRMED' || i.status === 'REOPENED');

  const summary = {
    total: openIssues.length,
    byType: {
      BUG: openIssues.filter((i) => i.type === 'BUG').length,
      VULNERABILITY: openIssues.filter((i) => i.type === 'VULNERABILITY').length,
      CODE_SMELL: openIssues.filter((i) => i.type === 'CODE_SMELL').length,
    },
    bySeverity: {
      BLOCKER: openIssues.filter((i) => i.severity === 'BLOCKER').length,
      CRITICAL: openIssues.filter((i) => i.severity === 'CRITICAL').length,
      MAJOR: openIssues.filter((i) => i.severity === 'MAJOR').length,
      MINOR: openIssues.filter((i) => i.severity === 'MINOR').length,
      INFO: openIssues.filter((i) => i.severity === 'INFO').length,
    },
    byLanguage: {} as Record<string, number>,
  };

  openIssues.forEach((issue) => {
    if (!summary.byLanguage[issue.language]) {
      summary.byLanguage[issue.language] = 0;
    }
    summary.byLanguage[issue.language]++;
  });

  res.json({ data: summary });
});

router.get('/:key', (req: Request, res: Response) => {
  const issue = issues.find((i) => i.key === req.params.key);
  if (!issue) {
    res.status(404).json({ error: 'Issue not found' });
    return;
  }
  res.json({ data: issue });
});

export default router;
