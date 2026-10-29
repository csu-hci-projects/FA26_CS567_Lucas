import { inject, injectable } from '@theia/core/shared/inversify';
import { MenuModelRegistry } from '@theia/core';
import { ProgressWidget } from './progress-widget';
import { TestWidget } from './test-widget';
import { MarkdownPreviewWidget } from './markdown-preview-widget';
import { AbstractViewContribution, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';
import { EditorManager } from '@theia/editor/lib/browser/editor-manager';
import { EditorWidget } from '@theia/editor/lib/browser/editor-widget';

export const ProgressWidgetCommand: Command = { id: 'progress:command' };
export const TestWidgetCommand: Command = { id: 'test:command' };
export const MarkdownPreviewWidgetCommand: Command = {
    id: 'markdown-preview:command'
};

@injectable()
export class ProgressWidgetContribution extends AbstractViewContribution<ProgressWidget> {

    constructor() {
        super({
            widgetId: ProgressWidget.ID,
            widgetName: ProgressWidget.LABEL,
            defaultWidgetOptions: { area: 'bottom' },
            toggleCommandId: ProgressWidgetCommand.id
        });
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(ProgressWidgetCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}

@injectable()
export class TestWidgetContribution extends AbstractViewContribution<TestWidget> {

    constructor() {
        super({
            widgetId: TestWidget.ID,
            widgetName: TestWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: TestWidgetCommand.id
        });
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(TestWidgetCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}

@injectable()
export class MarkdownPreviewContribution extends AbstractViewContribution<MarkdownPreviewWidget>
 implements FrontendApplicationContribution {

    @inject(EditorManager)
    protected readonly editorManager!: EditorManager;

    constructor() {
        super({
            widgetId: MarkdownPreviewWidget.ID,
            widgetName: MarkdownPreviewWidget.LABEL,
            defaultWidgetOptions: {
                area: 'main',
                mode: 'split-right',
            },
            toggleCommandId: MarkdownPreviewWidgetCommand.id
        });
    }

    onStart(): void {
        this.editorManager.onCreated(editor => this.openForMarkdownEditor(editor));
        this.editorManager.onCurrentEditorChanged(editor => {
            if (editor) {
                this.openForMarkdownEditor(editor);
            }
        });
        const markdownEditor = this.editorManager.all.find(editor => this.isMarkdownEditor(editor));
        if (markdownEditor) {
            this.openForMarkdownEditor(markdownEditor);
        }
    }

    protected openForMarkdownEditor(editor: EditorWidget): void {
        if (this.isMarkdownEditor(editor)) {
            void this.openView({ activate: false, reveal: true });
        }
    }

    protected isMarkdownEditor(editor: EditorWidget): boolean {
        return editor.editor.uri.path.toString().toLowerCase().endsWith('.md');
    }

    override registerCommands(commands: CommandRegistry): void {
        super.registerCommands(commands);
    }

    override registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}
