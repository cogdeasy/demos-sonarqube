import { Router, Request, Response } from 'express';
import { qualityGates } from '../data/qualityGates';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ data: qualityGates });
});

router.get('/:id', (req: Request, res: Response) => {
  const gate = qualityGates.find((g) => g.id === req.params.id);
  if (!gate) {
    res.status(404).json({ error: 'Quality gate not found' });
    return;
  }
  res.json({ data: gate });
});

export default router;
