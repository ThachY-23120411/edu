import express, { Application, Request, Response, NextFunction } from 'express';
import userRouter from './modules/user/user.router';
import catalogRouter from './modules/catalog/catalog.router';
import examRouter from './modules/exam/exam.router';
import attemptRouter from './modules/attempt/attempt.router';
import resultRouter from './modules/result/result.router';
import notebookRouter from './modules/notebook/notebook.router';
import vocabularyRouter from './modules/vocabulary/vocabulary.router';

export function createApp(): Application {
  const app = express();

  // Basic CORS middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.use(express.json());

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'EduTest Pro Modular Monolith API',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Modular Monolith routers
  app.use('/api/user', userRouter);
  app.use('/api/catalog', catalogRouter);
  app.use('/api/exams', examRouter);
  app.use('/api/attempts', attemptRouter);
  app.use('/api/results', resultRouter);
  app.use('/api/notebook', notebookRouter);
  app.use('/api/vocabulary', vocabularyRouter);

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[API Error]:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}
