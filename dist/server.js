"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const server_1 = require("./api/server");
const postgres_1 = require("./storage/postgres");
async function startServer() {
    const storage = new postgres_1.PostgresStorage({
        type: 'postgres',
        connection: process.env.DB_CONNECTION || 'postgresql://postgres:password@localhost:5432/stepci'
    });
    console.log('Initializing storage...');
    await storage.initialize();
    const api = new server_1.ReporterAPI(storage);
    const port = parseInt(process.env.PORT || '3000');
    console.log('Starting API server...');
    await api.start(port);
    console.log(`Reporter API running on port ${port}`);
}
startServer().catch(console.error);
