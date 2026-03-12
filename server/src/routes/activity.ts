import { Router, Request, Response } from 'express';
import { activityHistory } from '../data/activity';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ data: activityHistory });
});

export default router;
