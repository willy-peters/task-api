import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import config from './config/env.js';
import swaggerSpec from './config/swagger.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// ---------- API docs ----------
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customSiteTitle: 'Task API Docs' })
);
// Raw OpenAPI JSON (importable into Postman / Insomnia)
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

// ---------- Global middleware ----------
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10kb' }));

if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// ---------- Routes ----------
app.use('/api/v1', routes);

// ---------- Error handling ----------
app.use(notFound);
app.use(errorHandler);

export default app;