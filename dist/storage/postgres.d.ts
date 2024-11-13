import { StorageProvider } from './base';
import { StorageConfig, TestRunRecord, TestRunFilters, TestStats } from '../core/types';
export declare class PostgresStorage extends StorageProvider {
    private config;
    private pool;
    constructor(config: StorageConfig);
    initialize(): Promise<void>;
    saveTestRun(record: TestRunRecord): Promise<void>;
    getTestRun(id: string): Promise<TestRunRecord>;
    getTestRuns(filters: TestRunFilters): Promise<TestRunRecord[]>;
    getTestStats(workflowName: string): Promise<TestStats>;
    private mapDbRecordToTestRun;
}
