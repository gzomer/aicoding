import * as vscode from 'vscode';
import * as codegen from './codegen';
import * as generator from './generator';
import HumanAILoopView from './views';
import { getState } from './state';

async function editCode(context: vscode.ExtensionContext, text:string) {
	if (getState().isGenerating()) {
		// Show error message
		vscode.window.showErrorMessage('Code is still being generated.');
		return;
	}
	// Show error message if text( trim) is empty
	if (text.trim() === '') {
		vscode.window.showErrorMessage('Please enter a valid instruction.');
		return;
	}
	// Add status bar item and wait for click
	if (!vscode.window.activeTextEditor) {
		vscode.window.showErrorMessage('No file is current opened in the editor.');
		return;
	}
	let currentFolder = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri)?.uri.fsPath;
	if (!currentFolder) {
		return;
	}
	let currentFile = vscode.window.activeTextEditor.document.fileName;

	await codegen.edit(context, getState(), text, currentFile, currentFolder);
}

function documentCode(context: vscode.ExtensionContext, text:string) {
	text = 'Add more comments #//';
	return editCode(context, text);
}

function codeQuality(context: vscode.ExtensionContext, text:string) {
	text = 'Improve code quality and formatting.';
	return editCode(context, text);
}

export function activate(context: vscode.ExtensionContext) {
	const provider = new HumanAILoopView(context.extensionUri);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(HumanAILoopView.viewType, provider));

	context.subscriptions.push(vscode.commands.registerCommand('codegen.edit', (text) => {
		editCode(context, text);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('codegen.docs', (text) => {
		documentCode(context, text);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('codegen.quality', (text) => {
		codeQuality(context, text);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('codegen.humanailoop.accept', async () => {
		await codegen.accept(getState());
		provider.clearInput();
	}));
	context.subscriptions.push(vscode.commands.registerCommand('codegen.humanailoop.cancel', async () => {
		await codegen.cancel(getState());
	}));

	context.subscriptions.push(vscode.commands.registerCommand('codegen.install', async () => {
		if (getState().isGenerating()) {
			return;
		}
		// Add status bar item and wait for click
		if (!vscode.window.activeTextEditor) {
			return;
		}
		// Show a message box to the user with loading animation
		let currentFile = vscode.window.activeTextEditor.document.fileName;

		let command = {
			'type': 'install',
			'file': currentFile
		};

		getState().startGenerating();
		getState().bar.loading.show();
		let code = '';
		try {
			code = await generator.generateCode(command, currentFile);
		}
		catch (e) {
			vscode.window.showErrorMessage('Error generating code.');
			getState().endGenerating();
			getState().bar.loading.hide();
			return;
		}
		getState().endGenerating();
		getState().bar.loading.hide();

		// Get first line only
		let firstLine = code.split('\n')[0];

		vscode.commands.executeCommand('workbench.action.terminal.focus');
		vscode.commands.executeCommand('workbench.action.terminal.sendSequence', {
			text: firstLine
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('codegen.generate', async () => {
		if (getState().isLooping()) {
			vscode.window.showInformationMessage('Generation is already in progress.');
			return;
		}
		// Add status bar item and wait for click
		if (!vscode.window.activeTextEditor) {
			return;
		}
		// Show a message box to the user with loading animation
		let loading = vscode.window.setStatusBarMessage('Generating code...');
		let currentFile = vscode.window.activeTextEditor.document.fileName;
		await codegen.generate(context, getState(), currentFile);
		// Hide message box
		loading.dispose();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('codegen.tests', async () => {
		// Add status bar item and wait for click
		if (!vscode.window.activeTextEditor) {
			return;
		}
		let currentFolder = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri)?.uri.fsPath;
		if (!currentFolder) {
			return;
		}

		let currentFile = vscode.window.activeTextEditor.document.fileName;
		await codegen.generateTests(context, getState(), currentFile, currentFolder);
	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }
