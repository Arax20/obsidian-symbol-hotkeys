import {Editor, MarkdownView, Plugin} from 'obsidian';

export default class MyPlugin extends Plugin {
	async onload() {
		console.log('loading plugin');

		this.addCommand({
			id:"insert-math",
			name:"Insert math wrapper",
			callback: () => this.insertMath(),
			hotkeys: [
			{
				modifiers: ["Mod"],
				key: "m"
			}],
		});

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
		console.log('unloading plugin');
	}
}