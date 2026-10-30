import {
    Command,
    CommandContribution,
    CommandRegistry,
    URI
} from '@theia/core/lib/common';
import { MessageService } from '@theia/core';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { SingleTextInputDialog as InputDialog } from '@theia/core/lib/browser/dialogs';
import { inject, injectable } from '@theia/core/shared/inversify';
import { ExperimentBackendService } from '../common/protocol';

const StartExperimentCommand: Command = {
    id: 'experiment.command',
    label: 'Experiment: Start',
};

@injectable()
export class ExperimentCommandContribution implements CommandContribution {

    @inject(ExperimentBackendService)
    protected readonly backendService!: ExperimentBackendService;

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @inject(WorkspaceService)
    protected readonly workspaceService!: WorkspaceService;

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(StartExperimentCommand, {
            execute: async() => {
                const dialog = new InputDialog({
                    title: 'Start Experiment',
                    placeholder: 'Enter participant ID...'
                });

                const input = await dialog.open();

                if (!input?.trim()) {
                    return;
                }

                try {
                    const result = await this.backendService.startExperiment(input);
                    await this.workspaceService.openWorkspace(URI.fromFilePath(result), {
                        preserveWindow: true
                    });
                    this.messageService.info(result);
                } catch (error) {
                    const message = error instanceof Error
                        ? error.message
                        : String(error);

                    this.messageService.error(`Request failed: ${message}`);
                }
            }
        });
    }
}
