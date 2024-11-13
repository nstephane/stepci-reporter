// test/setup.ts
import { Pool } from 'pg';

beforeAll(async () => {
  // Setup test database
  const pool = new Pool({
    connectionString: process.env.TEST_DB_URL || 'postgresql://localhost:5432/test'
  });

  await pool.query(`
    DROP TABLE IF EXISTS test_runs;
  `);
});

afterAll(async () => {
  // Cleanup
});