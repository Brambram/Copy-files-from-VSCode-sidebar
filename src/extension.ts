// File: src/extension.ts

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.copySelectedFiles', async () => {
        let selectedFiles: vscode.Uri[] = [];

        // Get the selected files from the explorer
        if (vscode.window.activeTextEditor) {
            selectedFiles = [vscode.window.activeTextEditor.document.uri];
        } else {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders) {
                const result = await vscode.window.showOpenDialog({
                    canSelectMany: true,
                    openLabel: 'Select Files',
                    defaultUri: workspaceFolders[0].uri
                });
                if (result) {
                    selectedFiles = result;
                }
            }
        }

        if (selectedFiles.length === 0) {
            vscode.window.showWarningMessage('No files selected.');
            return;
        }

        let formattedContent = '';

        for (const file of selectedFiles) {
            try {
                const content = fs.readFileSync(file.fsPath, 'utf8');
                const fileName = path.basename(file.fsPath);
                formattedContent += `File: ${fileName}\n\`\`\`\n${content}\n\`\`\`\n\n`;
            } catch (err) {
                const error = err as Error;
                vscode.window.showErrorMessage(`Error reading file ${file.fsPath}: ${error.message}`);
            }
        }

        vscode.env.clipboard.writeText(formattedContent);
        vscode.window.showInformationMessage('Formatted code copied to clipboard!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}