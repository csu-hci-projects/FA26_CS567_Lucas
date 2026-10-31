import { inject, injectable } from "@theia/core/shared/inversify";
import { nls } from "@theia/core";
import { PerspectiveContribution, PerspectiveService, ApplicationShell } from "@theia/core/lib/browser";
import { EXPLORER_VIEW_CONTAINER_ID } from '@theia/navigator/lib/browser';
import { ChatSessionStore } from "@theia/ai-chat";
import { AISessionsWidget } from "@theia/ai-ide/lib/browser/ai-sessions-widget";
import { ChatViewWidget } from "@theia/ai-chat-ui/lib/browser/chat-view-widget";
import { TestTreeWidget } from "@theia/test/lib/browser/view/test-tree-widget";
import { ProgressWidget } from "./progress-widget";
import { TestWidget } from "./test-widget";
import { TestResultWidget } from "@theia/test/lib/browser/view/test-result-widget";

@injectable()
export class TutorPerspectiveContribution implements PerspectiveContribution {
    @inject(ChatSessionStore)
    protected readonly sessions!: ChatSessionStore;

    registerPerspectives(service: PerspectiveService): void {
        service.registerPerspective({
            id: 'tutor-perspective',
            label: nls.localize('theia-tutor/perspective/tutor', 'Tutor'),
            viewPlacements: new Map<string, ApplicationShell.Area>([
                [TestTreeWidget.ID, 'left'],
                [TestWidget.ID, 'left'],
                [EXPLORER_VIEW_CONTAINER_ID, 'left'],
                [ProgressWidget.ID, 'bottom'],
                [TestResultWidget.ID, 'bottom'],
                [ChatViewWidget.ID, 'right'],
                [AISessionsWidget.ID, 'right']
            ]),
            primaryViews: {
                left: TestTreeWidget.ID,
                bottom: ProgressWidget.ID,
                right: ChatViewWidget.ID
            },
            onActivate: _shell => {
               this.sessions.clearAllSessions();
            }
        });
        service.registerPerspective({
            id: 'no-tutor-perspective',
            label: nls.localize('theia-tutor/perspective/no-tutor', 'No Tutor'),
            viewPlacements: new Map<string, ApplicationShell.Area>([
                [TestTreeWidget.ID, 'left'],
                [TestWidget.ID, 'left'],
                [EXPLORER_VIEW_CONTAINER_ID, 'left'],
                [TestResultWidget.ID, 'bottom'],
            ]),
            chromeOptions: {
                collapseAreas: ['right']
            }
        });
    }
}