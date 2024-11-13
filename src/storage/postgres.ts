// src/storage/postgres.ts
import { Pool } from 'pg';
import { StorageProvider } from './base';
import { StorageConfig, TestRunRecord, TestRunFilters, TestStats } from '../core/types';

export class PostgresStorage extends StorageProvider {
  private pool: Pool;

  constructor(private config: StorageConfig) {
    super();
    this.pool = new Pool({
      connectionString: config.connection
    });
  }

  async initialize(): Promise<void> {
    // Create tables if they don't exist
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS test_runs (
        id UUID PRIMARY KEY,
        workflow_name TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        duration INTEGER NOT NULL,
        status TEXT NOT NULL,
        environment JSONB,
        test_results JSONB NOT NULL,
        metadata JSONB
      );
      
      CREATE INDEX IF NOT EXISTS idx_test_runs_workflow 
      ON test_runs(workflow_name);
      
      CREATE INDEX IF NOT EXISTS idx_test_runs_timestamp 
      ON test_runs(timestamp);
    `);
  }

  async saveTestRun(record: TestRunRecord): Promise<void> {
    await this.pool.query(
      `INSERT INTO test_runs 
       VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        record.id,
        record.workflowName,
        record.timestamp,
        record.duration,
        record.status,
        JSON.stringify(record.environment),
        JSON.stringify(record.testResults),
        JSON.stringify(record.metadata)
      ]
    );
  }

  async getTestRun(id: string): Promise<TestRunRecord> {
    const result = await this.pool.query(
      'SELECT * FROM test_runs WHERE id = $1',
      [id]
    );
    return this.mapDbRecordToTestRun(result.rows[0]);
  }

  async getTestRuns(filters: TestRunFilters): Promise<TestRunRecord[]> {
    const conditions = [];
    const params = [];

    if (filters.workflowName) {
      conditions.push(`workflow_name = $${params.length + 1}`);
      params.push(filters.workflowName);
    }

    if (filters.from) {
      conditions.push(`timestamp >= $${params.length + 1}`);
      params.push(filters.from);
    }

    if (filters.to) {
      conditions.push(`timestamp <= $${params.length + 1}`);
      params.push(filters.to);
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

    const result = await this.pool.query(
      `SELECT * FROM test_runs ${whereClause} ORDER BY timestamp DESC`,
      params
    );

    return result.rows.map(this.mapDbRecordToTestRun);
  }

  async getTestStats(workflowName: string): Promise<TestStats> {
    const result = await this.pool.query(`
      SELECT 
        COUNT(*) as total_runs,
        AVG(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) * 100 as pass_rate,
        AVG(duration) as avg_duration,
        MAX(timestamp) as last_run
      FROM test_runs
      WHERE workflow_name = $1
    `, [workflowName]);

    return {
      totalRuns: parseInt(result.rows[0].total_runs),
      passRate: parseFloat(result.rows[0].pass_rate),
      avgDuration: parseFloat(result.rows[0].avg_duration),
      lastRun: new Date(result.rows[0].last_run)
    };
  }

  private mapDbRecordToTestRun(row: any): TestRunRecord {
    return {
      id: row.id,
      workflowName: row.workflow_name,
      timestamp: new Date(row.timestamp),
      duration: row.duration,
      status: row.status,
      environment: row.environment,
      testResults: row.test_results,
      metadata: row.metadata
    };
  }
}