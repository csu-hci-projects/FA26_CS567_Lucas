import { TutorTestCase } from './tutor-test-case-schema';

export const TutorTestRunnerService = Symbol('TutorTestRunnerService');
export const tutorTestRunnerServicePath = '/services/tutor-test-runner';

export type TutorTestExecutionState = 'passed' | 'failed' | 'errored';

export interface TutorTestExecutionResult {
    state: TutorTestExecutionState;
    output: string[];
    message?: string;
    expectedOutput?: string;
    actualOutput?: string;
}

export interface TutorTestRunnerService {
    runTestCase(testCase: TutorTestCase, root: string): Promise<TutorTestExecutionResult>;
}

export const ExperimentBackendService = Symbol('ExperimentBackendService');
export const EXPERIMENT_BACKEND_PATH = '/services/experimentBackend';

export interface ExperimentBackendService {
    startExperiment(name: string): Promise<string>
}
