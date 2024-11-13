// src/server.ts
import { ReporterAPI } from './api/server';
import { PostgresStorage } from './storage/postgres';

async function startServer() {
    const storage = new PostgresStorage({
        type: 'postgres',
        connection: process.env.DB_CONNECTION || 'postgresql://postgres:password@localhost:5432/stepci'
    });

    console.log('Initializing storage...');
    await storage.initialize();

    const api = new ReporterAPI(storage);
    const port = parseInt(process.env.PORT || '3000');
    
    console.log('Starting API server...');
    await api.start(port);
    console.log(`Reporter API running on port ${port}`);
}

startServer().catch(console.error);