import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects';
import issuesRouter from './routes/issues';
import securityHotspotsRouter from './routes/securityHotspots';
import rulesRouter from './routes/rules';
import qualityGatesRouter from './routes/qualityGates';
import activityRouter from './routes/activity';
import metricsRouter from './routes/metrics';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/security-hotspots', securityHotspotsRouter);
app.use('/api/rules', rulesRouter);
app.use('/api/quality-gates', qualityGatesRouter);
app.use('/api/activity', activityRouter);
app.use('/api/metrics', metricsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`SonarQube Demo API server running on port ${PORT}`);
});

export default app;
