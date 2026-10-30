import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { ContainerModule } from '@theia/core/shared/inversify';
import {
    ExperimentBackendService,
    EXPERIMENT_BACKEND_PATH,
    TutorTestRunnerService,
    tutorTestRunnerServicePath
} from '../common/protocol';
import {
    JavaTutorTestCaseExecutor,
    TutorTestCaseExecutor,
    TutorTestRunnerServiceImpl
} from './tutor-test-service';
import { ExperimentBackendServiceImpl } from './experiment-service';

export default new ContainerModule(bind => {
    bind(TutorTestCaseExecutor).to(JavaTutorTestCaseExecutor).inSingletonScope();
    bind(TutorTestRunnerService).to(TutorTestRunnerServiceImpl).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler(tutorTestRunnerServicePath, () => ctx.container.get<TutorTestRunnerService>(TutorTestRunnerService))
    ).inSingletonScope();

    bind(ExperimentBackendService).to(ExperimentBackendServiceImpl).inSingletonScope()
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new RpcConnectionHandler(EXPERIMENT_BACKEND_PATH, () => {
            return ctx.container.get<ExperimentBackendService>(ExperimentBackendService);
        })
    ).inSingletonScope();

});
