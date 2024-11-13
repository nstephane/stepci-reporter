// src/core/types.ts
import { TestResult } from '@stepci/runner';

export interface StorageConfig {
  type: 'postgres' | 'mongodb';
  connection: string;
}

export interface ReporterConfig {
  storage: StorageConfig;
  apiPort?: number;  // Added this line - optional port number
  retention?: number; // Optional - days to keep data
  enabled?: boolean; // Optional - enable/disable the reporter
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