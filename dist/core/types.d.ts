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
export interface TestStep {
    id: string;
    name: string;
    type: string;
    duration: number;
    status: 'passed' | 'failed';
    request?: {
        method?: string;
        url?: string;
        headers?: Record<string, string>;
        body?: any;
    };
    response?: {
        status?: number;
        statusText?: string;
        headers?: Record<string, string>;
        body?: any;
    };
    expectations?: Array<{
        name: string;
        expected: any;
        actual: any;
        passed: boolean;
    }>;
    error?: string;
}
export interface DetailedTest {
    id: string;
    name: string;
    duration: number;
    status: 'passed' | 'failed';
    steps: TestStep[];
}
export interface TestRunRecord {
    id: string;
    workflowName: string;
    timestamp: Date;
    duration: number;
    status: 'passed' | 'failed';
    environment?: Record<string, string>;
    testResults: DetailedTest[];
    metadata?: {
        environment?: string;
        tags?: string[];
        custom?: Record<string, any>;
    };
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
