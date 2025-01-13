import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundRoute from './app/middleware/notFoundRoute';
import cookieParser from 'cookie-parser';
import { ModulesRoutes } from './app/routes';
import limiter from './app/middleware/limiter';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import compression from 'compression';

const app: Application = express();

// reduce response size
app.use(compression());

// parsers
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);
app.use(cookieParser());

// swagger docs
// eslint-disable-next-line no-undef
const swaggerPath = path.resolve(__dirname, './docs/swagger.yaml');
const swaggerDocument = YAML.load(swaggerPath);
app.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// rate limiter middleware
app.use(limiter);

// application routes
app.use('/api/v1', ModulesRoutes);

const homeRoute = async (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'H4 recipe community is running !',
  });
};

app.get('/', homeRoute);

// global error handler
app.use(globalErrorHandler);
// global not found route
app.all('*', notFoundRoute);

export default app;
