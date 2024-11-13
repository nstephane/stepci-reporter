"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const postgres_1 = require("./storage/postgres");
const uuid_1 = require("uuid");
let storage = null;
async function default_1(input, captures, cookies, schemaValidator, options, config) {
    console.log('Reporter Plugin: Running with input', input);
    // Initialize storage if not done yet
    if (!storage) {
        storage = new postgres_1.PostgresStorage({
            type: 'postgres',
            connection: process.env.DB_CONNECTION || 'postgresql://localhost:5432/stepci'
        });
        await storage.initialize();
        console.log('Storage initialized');
    }
    const stepResult = {
        type: 'stepci-reporter'
    };
    try {
        switch (input.params.action) {
            case 'save':
                await storage.saveTestRun({
                    id: input.params.testId || (0, uuid_1.v4)(),
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
    }
    catch (error) {
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
