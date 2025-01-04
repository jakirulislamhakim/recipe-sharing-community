import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundRoute from './app/middleware/notFoundRoute';
import cookieParser from 'cookie-parser';
import { ModulesRoutes } from './app/routes';
import limiter from './app/middleware/limiter';

const app: Application = express();

// parsers
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);
app.use(cookieParser());

// rate limiter middleware
app.use(limiter);

// application routes
app.use('/api/v1', ModulesRoutes);

const homeRoute = async (req: Request, res: Response) => {
  res.send({
    success: true,
    message: 'Server is healthy!!',
  });
};

app.get('/', homeRoute);

// global error handler
app.use(globalErrorHandler);
// global not found route
app.all('*', notFoundRoute);

export default app;
