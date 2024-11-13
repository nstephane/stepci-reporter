// src/index.ts
import { CapturesStorage } from '@stepci/runner/dist/utils/runner'
import { WorkflowConfig, WorkflowOptions, StepRunResult } from '@stepci/runner/dist'
import { PostgresStorage } from './storage/postgres';
import { v4 as uuidv4 } from 'uuid';

export type ReporterPlugin = {
  id: "stepci-reporter"
  params: {
    action: 'save' | 'get'
    workflowName?: string
    testId?: string
  }
  check?: {
    saved?: boolean
    exists?: boolean
  }
}

let storage: PostgresStorage | null = null;

export default async function (
  input: ReporterPlugin,
  captures: CapturesStorage,
  cookies: any,
  schemaValidator: any,
  options?: WorkflowOptions,
  config?: WorkflowConfig
) {
  console.log('Reporter Plugin: Running with input', input);

  // Initialize storage if not done yet
  if (!storage) {
    storage = new PostgresStorage({
      type: 'postgres',
      connection: process.env.DB_CONNECTION || 'postgresql://localhost:5432/stepci'
    });
    await storage.initialize();
    console.log('Storage initialized');
  }

  const stepResult: StepRunResult = {
    type: 'stepci-reporter'
  };

  try {
    switch (input.params.action) {
      case 'save':
        await storage.saveTestRun({
          id: input.params.testId || uuidv4(),
          workflowName: input.params.workflowName || 'unknown',
          timestamp: new Date(),
          duration: 0,
          status: 'passed',
          testResults: []
        });

        if (input.check?.saved) {
          stepResult.checks = {
            saved: {
              passed: true,
              expected: true,
              given: true
            }
          };
        }
        break;

      case 'get':
        const results = await storage.getTestRuns({
          workflowName: input.params.workflowName
        });
        
        // Instead of using set, we'll store it directly in captures
        captures['results'] = results;
        
        if (input.check?.exists) {
          stepResult.checks = {
            exists: {
              passed: results.length > 0,
              expected: true,
              given: results.length > 0
            }
          };
        }
        break;
    }
  } catch (error) {
    console.error('Reporter Plugin Error:', error);
    stepResult.checks = {
      execution: {
        passed: false,
        expected: 'successful execution',
        given: String(error)
      }
    };
  }

  return stepResult;
}