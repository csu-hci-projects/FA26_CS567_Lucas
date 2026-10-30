import { injectable } from '@theia/core/shared/inversify';
import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { ExperimentBackendService } from '../common/protocol';

@injectable()
export class ExperimentBackendServiceImpl implements ExperimentBackendService {
    private readonly problemRoot = join(homedir(), 'problem');
    private readonly projectRoot = join(homedir(), 'project');

    async startExperiment(name: string): Promise<string> {
        const experimentWorkspace = join(this.problemRoot, 'experiment.theia-workspace');
        const root = await fs.readlink(this.projectRoot);
        const dest = join(root, name);
        const id = Number(name);
        if(!id) throw new Error('Not a number!');
        const folders = [
            {
                path: join(dest, 'Task-1'),
                name: 'Task 1 ' + (id % 2 ? 'w/' : 'w/o') + ' Tutor'
            },
            {
                path: join(dest, 'Task-2'),
                name: 'Task 2 ' + (id % 2 ? 'w/o' : 'w/') + ' Tutor'
            },
        ];
        await fs.writeFile(
            experimentWorkspace,
            JSON.stringify({ folders }, undefined, 2)
        );
        try {
            await fs.access(dest);
            // throw new Error(`Workspace "${name}" already exists.`);
        } catch {
            await fs.cp(this.problemRoot, dest, {
                recursive: true
            });
        }       
        await fs.appendFile(
            join(folders[0].path, 'Problem.md'),
            '\n\nYou are to do this problem in **' +
            (id % 2 ? 'Tutor' : 'No Tutor') + '** mode.' +
            '\n\nUse `F1>View: Switch Perspective` to change modes.'
        );
        await fs.appendFile(
            join(folders[1].path, 'Problem.md'),
            '\n\nYou are to do this problem in **' +
            (id % 2 ? 'No Tutor' : 'Tutor') + '** mode.' +
            '\n\nUse `F1>View: Switch Perspective` to change modes.'
        );
        return experimentWorkspace;
    }
}
