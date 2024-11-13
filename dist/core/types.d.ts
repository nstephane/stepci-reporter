import { TestResult } from '@stepci/runner';
export interface StorageConfig {
    type: 'postgres' | 'mongodb';
    connection: string;
}
export interface ReporterConfig {
    storage: StorageConfig;
    apiPort?: number;
    retention?: number;
    enabled?: boolean;
}
export interface TestRunRecord {
    id: string;
    workflowName: string;
    timestamp: Date;
    duration: number;
    status: 'passed' | 'failed';
    environment?: Record<string, string | undefined>;
    testResults: TestResult[];
    metadata?: Record<string, any>;
}
export interface TestRunFilters {
    workflowName?: string;
    from?: string;
    to?: string;
}
export interface TestStats {
    totalRuns: number;
    passRate: number;
    avgDuration: number;
    lastRun: Date;
}
