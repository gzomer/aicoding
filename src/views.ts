import * as vscode from 'vscode';

const template =
`
<!DOCTYPE html>
	<html lang="en">
	   <head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <style>
			 #generateButton {
			 background-color: #007bff;
			 border: none;
			 color: white;
			 padding: 8px 16px;
			 text-align: center;
			 text-decoration: none;
			 display: inline-block;
			 font-size: 16px;
			 margin: 4px 0px;
			 cursor: pointer;
			 width: 100%;
			 box-sizing: border-box;
			 }
			 textarea {
			 width: 100%;
			 resize: vertical;
			 box-sizing: border-box;
			 font-family: sans-serif;
			 }
			 #fixButton {
                 font-size:11px;
			 background-color: #b8383d;
			 border: none;
			 color: white;
			 padding: 8px 4px;
			 text-align: center;
			 text-decoration: none;
			 display: inline-block;
			 margin: 4px 0px;
			 cursor: pointer;
			 width: 100%;
			 box-sizing: border-box;
			 }
			 #explainButton {
                font-size:11px;
			 background-color: #b8383d;
			 border: none;
			 color: white;
			 padding: 8px 4px;
			 text-align: center;
			 text-decoration: none;
			 display: inline-block;

			 margin: 4px 0px;
			 cursor: pointer;
			 width: 100%;
			 box-sizing: border-box;
			 }
		  </style>
	   </head>
	   <body>
		  <textarea placeholder="Type your instruction to the AI" rows="5" type="text" id="input" id="textarea"></textarea>
		  <button id="generateButton">Generate</button>
		  <div style="display: flex;gap: 6px;">
			 <div style="flex: 1;">
				<button id="fixButton">Fix error</button>
			 </div>
			 <div style="flex: 1;">
				<button id="explainButton">Explain error</button>
			 </div>
		  </div>
		  <script>
			 const vscode = acquireVsCodeApi();
			 const fixButton = document.getElementById('fixButton');
			 const explainButton = document.getElementById('explainButton');

			 function sendMessageFix() {
			  vscode.postMessage({
			   command: 'fix',
               text: input.value
			  })
			 }

			 function sendMessageExplain() {
			  vscode.postMessage({
			   command: 'explain',
               text: input.value
			  })
			 }

			 // Send message when clicking button
			 fixButton.addEventListener('click', sendMessageFix);
			 explainButton.addEventListener('click', sendMessageExplain);
		  </script>
		  <script>
			 (function() {
			  const button = document.getElementById('generateButton');
			  const input = document.getElementById('input');

			  function sendMessage() {
			   vscode.postMessage({
				   command: 'edit',
				   text: input.value
			   })
			  }

			  // Send message when clicking button
			  button.addEventListener('click', sendMessage);

			  window.addEventListener('message', event => {

			 const message = event.data; // The JSON data our extension sent

			 switch (message.command) {
				 case 'clear':
					 // Clear input
					 input.value = '';
					 break;
			 }
			 });
			 }())
		  </script>
	   </body>
	</html>
`;

class HumanAILoopView implements vscode.WebviewViewProvider {

	public static readonly viewType = 'codegen.editing';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
		};

		webviewView.webview.html = template;

		webviewView.webview.onDidReceiveMessage(
			(message: any) => {
				switch (message.command) {
					case 'edit':
						vscode.commands.executeCommand('codegen.edit', message.text);
						return;
					case 'fix':
						message.text ='Fix this error: ' + message.text;
						vscode.commands.executeCommand('codegen.edit', message.text);
						return;
					case 'explain':
						message.text ='Add a comment to where the error is happening:: ' + message.text;
						vscode.commands.executeCommand('codegen.edit', message.text);
						return;
				}
			});
	}

	public clearInput() {
		if (this._view) {
			this._view.webview.postMessage({ command: 'clear' });
		}
	}
}
export default HumanAILoopView;
