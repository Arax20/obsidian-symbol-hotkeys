import {Editor, MarkdownView, Plugin} from 'obsidian';

export default class MyPlugin extends Plugin {

	private symbolMode:boolean = false;
	private cmEditors: CodeMirror.Editor[];
	private symbols: { [key:string]:string;} = {
		'a': 'alpha',
		'b': 'beta',
		'c': 'chi',
		'd': 'delta',
		'e': 'epsilon',
		'f': 'phi',
		'g': 'gamma',
		'h': 'eta',
		'i': 'iota',
		'k': 'kappa',
		'l': 'lambda',
		'm': 'mu',
		'n': 'nu',
		'o': 'omicron',
		'p': 'pi',
		'q': 'theta',
		'r': 'rho',
		's': 'sigma',
		't': 'tau',
		'u': 'upsilon',
		'w': 'omega',
		'x': 'xi',
		'y': 'psi',
		'z': 'zeta',
	};
	private status: HTMLElement;

	async onload() {
		console.log('loading plugin');

		this.cmEditors = [];
		this.registerCodeMirror((cm) => {
			this.cmEditors.push(cm);
			// the callback has to be called through another function in order for 'this' to work
			cm.on('keydown', (cm, event) => this.handleKeyDown(cm, event));
		})


		this.addCommand({
			id:"insert-math",
			name:"Insert math wrapper",
			callback: () => this.insertMath(),
			hotkeys: [
			{
				modifiers: ["Mod"],
				key: "m"
			}],
		})

		this.addCommand({
			id:"insert-mhchem",
			name:"Insert chemistry wrapper",
			callback: () => this.insertChem(),
			hotkeys: [
			{
				modifiers: ["Mod", "Alt"],
				key: "m"
			}]
		})

		this.status = this.addStatusBarItem()
		this.status.setText('sym:[ ]')

		this.addCommand({
			id:"toggle-symbol-mode",
			name:"Toggle symbol mode",
			callback: () => this.toggleSymbolMode(),
			hotkeys: [
			{
				modifiers: ["Mod"],
				key: "w"
			}]
		})
	}

	private readonly handleKeyDown = (cm: CodeMirror.Editor, event: KeyboardEvent): void => { 
		if (this.symbolMode) {
			let key = event.key.toLowerCase();
			if (this.symbols.hasOwnProperty(key)) {
				let symbol = this.symbols[key];
				if (event.key.charAt(0) === event.key.charAt(0).toUpperCase()) {
					symbol = symbol.charAt(0).toUpperCase() + symbol.slice(1);
				}
				this.insertSymbol(symbol);
				event.preventDefault();
				this.toggleSymbolMode();
			};
		};
	}

	insertSymbol(symbol: string): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;
		const editor = view.editor;
		editor.replaceSelection(`\\${symbol}`);
	}

	toggleSymbolMode(): void {
		this.symbolMode = !this.symbolMode;
		this.symbolMode ? this.status.setText('symbol mode: on') : this.status.setText('symbol mode: off');
	}

	insertMath(): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;
		const editor = view.editor;

		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;
		if (selectedText) {
			editor.replaceSelection(`\$${selectedText}\$`);
		} else {
			editor.replaceSelection("\$\$");
			editor.exec("goLeft");
		}
	}

	insertChem(): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;
		const editor = view.editor;

		let selectedText = editor.somethingSelected()
		? editor.getSelection()
		: false;
		if (selectedText) {
			editor.replaceSelection(`\$\\ce{${selectedText}}\$`);
		} else {
			editor.replaceSelection("\$\\ce{}\$");
			editor.exec("goLeft");
			editor.exec("goLeft");
		}
	}

	onunload() {
		console.log('unloading symbols plugin');

		this.cmEditors.forEach((cm) => {
			cm.off('keydown', (cm, event) => this.handleKeyDown(cm, event));
		})
	}
}