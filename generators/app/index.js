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
			this.templatePath("__tests__/test.spec.ts"),
			this.destinationPath("__tests__/test.spec.ts"),
			{ name: this.props.name }
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
		this.fs.copyTpl(
			this.templatePath("README.md"),
			this.destinationPath("README.md"),
			{ name: this.props.name }
		);
		this.fs.copyTpl(
			this.templatePath("lib/index.ts"),
			this.destinationPath("lib/index.ts"),
			{ name: this.props.name }
		);
		this.fs.extendJSON(this.destinationPath("package.json"), {
			name: this.props.name,
			version: "0.0.1",
			main: "lib/index.ts",
			scripts: {
				test: "smac start -t -e",
				start:
					'tsc && concurrently --handle-input "smac start" "tsc -w"',
				"start:nukkit":
					'tsc && concurrently --handle-input "smac start -f smac-nukkit.json" "tsc -w"',
				"start:bukkit":
					'tsc && concurrently  --handle-input "smac start" "tsc -w"'
			},
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
				"concurrently",
				"@scriptcraft/types",
				"husky",
				"lint-staged",
				"@magikcraft/op-all",
				"@types/jasmine"
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
		this.log("\n" + chalk.yellow("===  Congratulations!!  ==="));
		this.log(
			`\nYour new plugin has been created in the directory: ${chalk.green(
				this.props.name
			)}.`
		);
		this.log(
			"\nRemember to start the TypeScript transpiler in that directory with the command:"
		);
		this.log(chalk.magenta("\ntsc -w"));
		this.log(
			`\nCheck the README file in the ${
				this.props.name
			} directory for instructions to start a development server and test your plugin.`
		);
	}
};
