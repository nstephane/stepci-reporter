"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const postgres_1 = require("./storage/postgres");
const uuid_1 = require("uuid");
let storage = null;
async function default_1(input, captures, cookies, schemaValidator, options, config) {
    console.log('Reporter Plugin: Running with input', input);
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
                const processStepChecks = (step) => {
                    if (!step.checks)
                        return [];
                    return Object.entries(step.checks).map(([name, check]) => ({
                        name,
                        expected: check.expected,
                        actual: check.given,
                        passed: !!check.passed
                    }));
                };
                const testData = {
                    id: input.params.testId || (0, uuid_1.v4)(),
                    workflowName: input.params.workflowName || 'unknown',
                    timestamp: new Date(),
                    duration: 0,
                    status: 'passed',
                    testResults: [{
                            id: (0, uuid_1.v4)(),
                            name: 'Current Test',
                            duration: 0,
                            status: 'passed',
                            steps: options?.result?.steps?.map((step) => ({
                                id: step.id || (0, uuid_1.v4)(),
                                name: step.name || 'Unnamed Step',
                                type: step.type || 'unknown',
                                duration: step.duration || 0,
                                status: step.passed ? 'passed' : 'failed',
                                request: step.request ? {
                                    method: step.request.method,
                                    url: step.request.url,
                                    headers: step.request.headers,
                                    body: step.request.body
                                } : undefined,
                                response: step.response ? {
                                    status: step.response.status,
                                    statusText: step.response.statusText,
                                    headers: step.response.headers,
                                    body: step.response.body
                                } : undefined,
                                expectations: processStepChecks(step),
                                error: step.errorMessage
                            })) || []
                        }],
                    environment: Object.fromEntries(Object.entries(process.env).filter(([_, v]) => v !== undefined)),
                    metadata: {
                        environment: process.env.NODE_ENV,
                        tags: input.params.tags,
                        custom: input.params.metadata
                    }
                };
                // Update overall status based on steps
                const hasFailedSteps = testData.testResults[0].steps.some(step => step.status === 'failed');
                testData.status = hasFailedSteps ? 'failed' : 'passed';
                testData.testResults[0].status = testData.status;
                // Calculate total duration
                testData.duration = testData.testResults[0].steps.reduce((total, step) => total + (step.duration || 0), 0);
                testData.testResults[0].duration = testData.duration;
                await storage.saveTestRun(testData);
                stepResult.checks = {
                    saved: {
                        passed: true,
                        expected: true,
                        given: true
                    }
                };
                break;
            case 'get':
                const results = await storage.getTestRuns({
                    workflowName: input.params.workflowName
                });
                captures['results'] = results;
                stepResult.checks = {
                    exists: {
                        passed: results.length > 0,
                        expected: true,
                        given: results.length > 0
                    }
                };
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
