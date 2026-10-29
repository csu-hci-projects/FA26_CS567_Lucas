import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { ILogger } from '@theia/core';
import { BinaryBuffer } from '@theia/core/lib/common/buffer';
import URI from '@theia/core/lib/common/uri';
import { inject, injectable, named } from '@theia/core/shared/inversify';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { ChatSession, SerializedChatData, CHAT_DATA_VERSION } from '@theia/ai-chat';

@injectable()
export class TutorChatStore {
    @inject(WorkspaceService)
    protected readonly workspaceService!: WorkspaceService;

    @inject(FileService)
    protected readonly fileService!: FileService;

    @inject(ILogger) @named('tutor-extension:TutorChatStore')
    protected readonly logger!: ILogger;

    async save(session: ChatSession): Promise<URI> {
        const root = await this.resolveFileUri();
        if (!root) {
            throw new Error('No workspace folder is open.');
        }

        const sessionFile = root.resolve(`${session.model.id}.json`);
        const modelData = session.model.toSerializable();
        const data: SerializedChatData = {
            version: CHAT_DATA_VERSION,
            title: session.title,
            pinnedAgentId: session.pinnedAgent?.id,
            saveDate: Date.now(),
            rootSessionId: session.rootSessionId,
            parentSessionId: session.parentSessionId,
            model: modelData
        };
        this.logger.debug('Writing session to file', {
            sessionId: session.model.id,
            title: data.title,
            filePath: sessionFile.toString(),
            requestCount: modelData.requests.length,
            responseCount: modelData.responses.length,
            pinnedAgentId: data.pinnedAgentId,
            version: data.version
        });
        await this.fileService.writeFile(
            sessionFile,
            BinaryBuffer.fromString(JSON.stringify(data, undefined, 2))
        );
        return sessionFile;
    }

    protected async resolveFileUri(): Promise<URI | undefined> {
        const roots = await this.workspaceService.roots;
        if (roots.length === 0) {
            return undefined;
        }

        return roots[0].resource.resolve('.theia');
    }

}
