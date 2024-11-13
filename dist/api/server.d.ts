import { StorageProvider } from '../storage/base';
export declare class ReporterAPI {
    private storage;
    private app;
    constructor(storage: StorageProvider);
    private setupMiddleware;
    private setupRoutes;
    start(port: number): Promise<unknown>;
}
