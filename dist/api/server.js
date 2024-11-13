"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporterAPI = void 0;
// src/api/server.ts
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
class ReporterAPI {
    constructor(storage) {
        this.storage = storage;
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        // Serve static files from the UI build
        this.app.use(express_1.default.static(path_1.default.join(__dirname, '../ui/dist')));
    }
    setupRoutes() {
        this.app.get('/api/runs', async (req, res) => {
            console.log('Received request for /api/runs');
            try {
                const runs = await this.storage.getTestRuns({});
                res.json(runs);
            }
            catch (error) {
                console.error('Error fetching runs:', error);
                res.status(500).json({ error: 'Failed to fetch runs' });
            }
        });
        this.app.get('/api/runs/:id', async (req, res) => {
            const run = await this.storage.getTestRun(req.params.id);
            res.json(run);
        });
        this.app.get('/api/stats/:workflow', async (req, res) => {
            const stats = await this.storage.getTestStats(req.params.workflow);
            res.json(stats);
        });
    }
    start(port) {
        return new Promise((resolve) => {
            this.app.listen(port, () => {
                console.log(`Reporter API running on port ${port}`);
                resolve(null);
            });
        });
    }
}
exports.ReporterAPI = ReporterAPI;
