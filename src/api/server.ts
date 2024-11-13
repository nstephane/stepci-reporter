// src/api/server.ts
import express, { Request, Response } from 'express';
import { StorageProvider } from '../storage/base';
import { TestRunFilters } from '../core/types';
import path from 'path';

export class ReporterAPI {
  private app: express.Application;

  constructor(private storage: StorageProvider) {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    // Serve static files from the UI build
    this.app.use(express.static(path.join(__dirname, '../ui/dist')));
  }

  private setupRoutes() {
    this.app.get('/api/runs', async (req: Request, res: Response) => {
      console.log('Received request for /api/runs');
      try {
        const runs = await this.storage.getTestRuns({});
        res.json(runs);
      } catch (error) {
        console.error('Error fetching runs:', error);
        res.status(500).json({ error: 'Failed to fetch runs' });
      }
    });

    this.app.get('/api/runs/:id', async (req: Request, res: Response) => {
      const run = await this.storage.getTestRun(req.params.id);
      res.json(run);
    });

    this.app.get('/api/stats/:workflow', async (req: Request, res: Response) => {
      const stats = await this.storage.getTestStats(req.params.workflow);
      res.json(stats);
    });
    
  }

  start(port: number) {
    return new Promise((resolve) => {
      this.app.listen(port, () => {
        console.log(`Reporter API running on port ${port}`);
        resolve(null);
      });
    });
  }
}