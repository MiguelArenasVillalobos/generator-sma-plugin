"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const mkdirp = require("mkdirp");
const _ = require("lodash");
const askName = require("inquirer-npm-name");

module.exports = class extends Generator {
	initializing() {
		this.composeWith(require.resolve("generator-git-init"));
	}
	prompting() {
		this.props = {};
		// Have Yeoman greet the user.
		this.log(
			yosay(
				`Welcome to the ${chalk.red(
					"Scriptcraft SMA Plugin"
				)} generator by Magikcraft.io!`
			)
		);

		return askName(
			{
				name: "name",
				message: "Your package name",
				default: path.basename(process.cwd())
			},
			this
		).then(props => {
			this.props.name = props.name;
		});
	}

	default() {
		if (path.basename(this.destinationPath()) !== this.props.name) {
			this.log(
				`Your plugin must be inside a folder named ${
					this.props.name
				}\nI'll automatically create this folder.`
			);
			mkdirp(this.props.name);
			this.destinationRoot(this.destinationPath(this.props.name));
		}
		const readmeTpl = _.template(
			this.fs.read(this.templatePath("README.md"))
		);

		this.composeWith(require.resolve("generator-node/generators/git"), {
			travis: false,
			name: this.props.name,
			projectRoot: "generators",
			skipInstall: this.options.skipInstall
		});
		this.composeWith(require.resolve("generator-node/generators/readme"), {
			travis: false,
			name: this.props.name,
			projectRoot: "generators",
			skipInstall: this.options.skipInstall,
			readme: readmeTpl({
				name: this.props.name,
				yoName: this.props.name.replace("generator-", "")
			})
		});
	}

	writing() {
		this.fs.copy(
			this.templatePath("gitignore"),
			this.destinationPath(".gitignore")
		);
		this.fs.copy(
			this.templatePath("editorconfig"),
			this.destinationPath(".editorconfig")
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
		this.fs.copyTpl(
			this.templatePath("smac.json"),
			this.destinationPath("smac.json"),
			{ name: this.props.name }
		);
		this.fs.copyTpl(
			this.templatePath("smac-nukkit.json"),
			this.destinationPath("smac-nukkit.json"),
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
			version: "0.0.1",
			main: "lib/index.ts",
			smaPluginConfig: {
				scriptcraft_load_dir: "autoload"
			},
			husky: {
				hooks: {
					"pre-commit": "tsc && lint-staged"
				}
			},
			"lint-staged": {
				"*.{ts,json,css,md}": ["prettier --write", "tsc", "git add"]
			}
		});
	}

	install() {
		this.installDependencies();
	}

	installDependencies() {
		this.npmInstall(
			[
				"prettier",
				"@scriptcraft/types",
				"husky",
				"lint-staged",
				"@magikcraft/op-all"
			],
			{
				"save-dev": true
			}
		);
		this.npmInstall(["@magikcraft/core"], {
			save: true
		});
	}

	end() {
		this.log(
			`Your new plugin has been created in the directory ${
				this.props.name
			}`
		);
		this.log(
			"Remember to start the TypeScript transpiler in that directory with the command:"
		);
		this.log("tsc -w");
		this.log(
			`\nCheck the README.md for how to start a development server to test your plugin.`
		);
	}
};
