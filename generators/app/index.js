"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
	initializing() {
		this.composeWith(require.resolve("generator-git-init"));
	}
	prompting() {
		// Have Yeoman greet the user.
		this.log(
			yosay(
				`Welcome to the ${chalk.red(
					"Scriptcraft SMA Plugin"
				)} generator by Magikcraft.io!`
			)
		);

		const prompts = [
			{
				type: "input",
				name: "name",
				message: "Your package name",
				default: this.appname // Default to current folder name
			},
			{
				type: "input",
				name: "description",
				message: "Package description",
				default: "A Scriptcraft SMA package"
			},
			{
				type: "input",
				name: "keywords",
				message: "Package keywords",
				default: "scriptcraft, scriptcraft-sma, plugin, minecraft"
			},
			{
				type: "input",
				name: "author",
				message: "Your Name",
				default: ""
			},
			{
				type: "input",
				name: "authorEmail",
				message: "Your Email",
				default: ""
			}
		];

		return this.prompt(prompts).then(props => {
			// To access props later use this.props.someAnswer;
			this.props = props;
		});
	}

	writing() {
		this.fs.copy(
			this.templatePath("gitignore"),
			this.destinationPath(".gitignore")
		);
		this.fs.copy(
			this.templatePath(".prettierrc"),
			this.destinationPath(".prettierrc")
		);
		this.fs.copyTpl(
			this.templatePath("tsconfig.json"),
			this.destinationPath("tsconfig.json"),
			{ name: this.props.name }
		);
		this.fs.copy(
			this.templatePath(".vscode/settings.json"),
			this.destinationPath(".vscode/settings.json")
		);
		this.fs.copyTpl(
			this.templatePath("autoload/index.ts"),
			this.destinationPath("autoload/index.ts"),
			{ name: this.props.name }
		);
		this.fs.copyTpl(
			this.templatePath("lib/log.ts"),
			this.destinationPath("lib/log.ts"),
			{ name: this.props.name }
		);
		this.fs.extendJSON(this.destinationPath("package.json"), {
			name: this.props.name,
			version: "1.0.0",
			description: this.props.description,
			keywords: this.props.keywords.split(","),
			author: `${this.props.author} <${this.props.authorEmail}>`,
			license: "ISC",
			smaPluginConfig: {
				scriptcraft_load_dir: "autoload"
			},
			husky: {
				hooks: {
					"pre-commit": "lint-staged"
				}
			},
			"lint-staged": {
				"*.{ts,js,json,css,md}": ["prettier --write", "tsc", "git add"]
			}
		});
	}

	install() {
		this.installDependencies();
	}

	installDependencies() {
		this.npmInstall(
			["prettier", "@scriptcraft/types", "husky", "lint-staged", "@magikcraft/op-all"],
			{
				"save-dev": true
			}
		);
	}
};
