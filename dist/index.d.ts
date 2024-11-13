import { CapturesStorage } from '@stepci/runner/dist/utils/runner';
import { WorkflowConfig, WorkflowOptions, StepRunResult, StepResult } from '@stepci/runner/dist';
export type ReporterPlugin = {
    id: "stepci-reporter";
    params: {
        action: 'save' | 'get';
        workflowName?: string;
        testId?: string;
        tags?: string[];
        metadata?: Record<string, any>;
    };
};
export default function (input: ReporterPlugin, captures: CapturesStorage, cookies: any, schemaValidator: any, options?: WorkflowOptions & {
    result?: {
        steps?: StepResult[];
    };
}, config?: WorkflowConfig): Promise<StepRunResult>;
