import { TestRunRecord, TestRunFilters, TestStats } from '../core/types';
export declare abstract class StorageProvider {
    abstract initialize(): Promise<void>;
    abstract saveTestRun(record: TestRunRecord): Promise<void>;
    abstract getTestRun(id: string): Promise<TestRunRecord>;
    abstract getTestRuns(filters: TestRunFilters): Promise<TestRunRecord[]>;
    abstract getTestStats(workflowName: string): Promise<TestStats>;
}
