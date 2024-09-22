"use strict";
// File: src/extension.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.copySelectedFiles', async () => {
        let selectedFiles = [];
        // Get the selected files from the explorer
        if (vscode.window.activeTextEditor) {
            selectedFiles = [vscode.window.activeTextEditor.document.uri];
        }
        else {
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
            }
            catch (err) {
                const error = err;
                vscode.window.showErrorMessage(`Error reading file ${file.fsPath}: ${error.message}`);
            }
        }
        vscode.env.clipboard.writeText(formattedContent);
        vscode.window.showInformationMessage('Formatted code copied to clipboard!');
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map