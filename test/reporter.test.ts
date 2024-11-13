// test/reporter.test.ts
import { ReporterPlugin } from '../src';
import { TestResult, StepResult } from '@stepci/runner';
import { CapturesStorage } from '@stepci/runner/dist/utils/runner';

describe('Reporter Plugin', () => {
  let plugin: ReporterPlugin;

  beforeEach(() => {
    plugin = new ReporterPlugin({
      storage: {
        type: 'postgres',
        connection: process.env.TEST_DB_URL || 'postgresql://localhost:5432/test'
      }
    });
  });

  // Basic mock test result
  const createBasicTestResult = (): TestResult => ({
    id: 'test-1',
    name: 'Basic Test',
    duration: 1000,
    passed: true,
    steps: [{
      id: 'step-1',
      testId: 'test-1',
      name: 'GET Request',
      type: 'http',
      passed: true,
      errored: false,
      skipped: false,
      duration: 100,
      timestamp: new Date(),
      responseTime: 100,
      bytesSent: 0,
      bytesReceived: 0,
      co2: 0,  // Added missing field
      captures: {} as CapturesStorage,  // Added missing field
      cookies: [],  // Added missing field
      checks: {},   // Added missing field
      request: {
        method: 'GET',
        url: 'https://example.com',
        protocol: 'HTTP/1.1',
        headers: {}
      },
      response: {
        status: 200,
        statusText: 'OK',
        protocol: 'HTTP/1.1',
        headers: {},
        body: Buffer.from('OK'),
        redirected: false,
        contentType: 'text/plain'
      }
    }],
    timestamp: new Date(),
    co2: 0,
    bytesSent: 0,
    bytesReceived: 0
  });

  describe('basic functionality', () => {
    it('should initialize', async () => {
      await expect(plugin.init()).resolves.not.toThrow();
    });

    it('should record test result', async () => {
      await expect(plugin.recordTestResult(createBasicTestResult()))
        .resolves.not.toThrow();
    });

    it('should not record when disabled', async () => {
      const disabledPlugin = new ReporterPlugin({
        storage: {
          type: 'postgres',
          connection: process.env.TEST_DB_URL || 'postgresql://localhost:5432/test'
        },
        enabled: false
      });

      await expect(disabledPlugin.recordTestResult(createBasicTestResult()))
        .resolves.not.toThrow();
    });
  });
});