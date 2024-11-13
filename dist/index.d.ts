import { CapturesStorage } from '@stepci/runner/dist/utils/runner';
import { WorkflowConfig, WorkflowOptions, StepRunResult } from '@stepci/runner/dist';
export type ReporterPlugin = {
    id: "stepci-reporter";
    params: {
        action: 'save' | 'get';
        workflowName?: string;
        testId?: string;
    };
    check?: {
        saved?: boolean;
        exists?: boolean;
    };
};
export default function (input: ReporterPlugin, captures: CapturesStorage, cookies: any, schemaValidator: any, options?: WorkflowOptions, config?: WorkflowConfig): Promise<StepRunResult>;
