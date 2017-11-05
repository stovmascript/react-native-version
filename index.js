const beautify = require("js-beautify").html;
const child = require("child_process");
const detectIndent = require("detect-indent");
const flatten = require("lodash.flatten");
const fs = require("fs");
const list = require("./util").list;
const log = require("./util").log;
const path = require("path");
const plist = require("plist");
const pSettle = require("p-settle");
const stripIndents = require("common-tags/lib/stripIndents");
const unique = require("lodash.uniq");
const Xcode = require("pbxproj-dom/xcode").Xcode;

/**
 * Custom type definition for Promises
 * @typedef Promise
 * @property {*} result See the implementing function for the resolve type and description
 * @property {Error} result Rejection error object
 */

const env = {
	target: process.env.RNV && list(process.env.RNV)
};

/**
 * Returns default values for some options, namely android/ios file/folder paths
 * @return {Object} Defaults
 */
function getDefaults() {
	return {
		android: "android/app/build.gradle",
		ios: "ios"
	};
}

/**
 * Versions your app
 * @param {Object} program commander/CLI-style options, camelCased
 * @param {string} projectPath Path to your React Native project
 * @return {Promise<string|Error>} A promise which resolves with the last commit hash
 */
function version(program, projectPath) {
	const prog = Object.assign({}, getDefaults(), program || {});

	const projPath = path.resolve(
		process.cwd(),
		projectPath || prog.args[0] || ""
	);

	const programOpts = Object.assign({}, prog, {
		android: path.join(projPath, prog.android),
		ios: path.join(projPath, prog.ios)
	});

	const targets = [].concat(programOpts.target, env.target).filter(Boolean);
	const appPkgJSONPath = path.join(projPath, "package.json");
	const MISSING_RN_DEP = "MISSING_RN_DEP";
	var appPkg;

	try {
		appPkg = require(appPkgJSONPath);

		if (!appPkg.dependencies["react-native"]) {
			throw new Error(MISSING_RN_DEP);
		}
	} catch (err) {
		if (err.message === MISSING_RN_DEP) {
			log({
				style: "red",
				text:
					"Is this the right folder? React Native isn't listed as a dependency in " +
					appPkgJSONPath
			});
		} else {
			log({
				style: "red",
				text: err.message
			});

			log({
				style: "red",
				text:
					"Is this the right folder? Looks like there isn't a package.json here"
			});
		}

		log({
			style: "yellow",
			text: "Pass the project path as an argument, see --help for usage"
		});

		if (program.outputHelp) {
			program.outputHelp();
		}

		process.exit(1);
	}

	var android;
	var ios;

	if (!targets.length || targets.indexOf("android") > -1) {
		android = new Promise(function(resolve, reject) {
			log({ text: "Versioning Android..." }, programOpts.quiet);

			var gradleFile;

			try {
				gradleFile = fs.readFileSync(programOpts.android, "utf8");
			} catch (err) {
				reject([
					{
						style: "red",
						text: "No gradle file found at " + programOpts.android
					},
					{
						style: "yellow",
						text: 'Use the "--android" option to specify the path manually'
					}
				]);
			}

			if (!programOpts.incrementBuild) {
				gradleFile = gradleFile.replace(
					/versionName "(.*)"/,
					'versionName "' + appPkg.version + '"'
				);
			}

			gradleFile = gradleFile.replace(/versionCode (\d+)/, function(
				match,
				cg1
			) {
				const newVersionCodeNumber = parseInt(cg1, 10) + 1;
				return "versionCode " + newVersionCodeNumber;
			});

			fs.writeFileSync(programOpts.android, gradleFile);
			log({ text: "Android updated" }, programOpts.quiet);
			resolve();
		});
	}

	if (!targets.length || targets.indexOf("ios") > -1) {
		ios = new Promise(function(resolve, reject) {
			log({ text: "Versioning iOS..." }, programOpts.quiet);

			if (program.legacy) {
				try {
					child.execSync("xcode-select --print-path", {
						stdio: ["ignore", "ignore", "pipe"]
					});
				} catch (err) {
					reject([
						{
							style: "red",
							text: err
						},
						{
							style: "yellow",
							text: "Looks like Xcode Command Line Tools aren't installed"
						},
						{
							text: "\n  Install:\n\n    $ xcode-select --install\n"
						}
					]);

					return;
				}

				const agvtoolOpts = {
					cwd: programOpts.ios
				};

				try {
					child.execSync("agvtool what-version", agvtoolOpts);
				} catch (err) {
					reject([
						{
							style: "red",
							text: "No project folder found at " + programOpts.ios
						},
						{
							style: "yellow",
							text: 'Use the "--ios" option to specify the path manually'
						}
					]);

					return;
				}

				if (!programOpts.incrementBuild) {
					child.spawnSync(
						"agvtool",
						["new-marketing-version", appPkg.version],
						agvtoolOpts
					);
				}

				if (programOpts.resetBuild) {
					child.execSync("agvtool new-version -all 1", agvtoolOpts);
				} else {
					child.execSync("agvtool next-version -all", agvtoolOpts);
				}
			} else {
				const xcode = Xcode.open(
					path.join(
						programOpts.ios,
						"AwesomeProjectEssentials.xcodeproj/project.pbxproj"
					)
				);

				xcode.document.projects.forEach(project => {
					const plistFilenames = unique(
						flatten(
							project.targets.map(target => {
								return target.buildConfigurationsList.buildConfigurations.map(
									config => {
										if (target.name === appPkg.name) {
											config.patch({
												buildSettings: {
													CURRENT_PROJECT_VERSION:
														parseInt(
															config.ast.value
																.get("buildSettings")
																.get("CURRENT_PROJECT_VERSION").text,
															10
														) + 1
												}
											});
										}

										return config.ast.value
											.get("buildSettings")
											.get("INFOPLIST_FILE").text;
									}
								);
							})
						)
					);

					const plistFiles = plistFilenames.map(filename => {
						return fs.readFileSync(
							path.join(programOpts.ios, filename),
							"utf8"
						);
					});

					const parsedPlistFiles = plistFiles.map(file => {
						return plist.parse(file);
					});

					parsedPlistFiles.forEach((json, index) => {
						fs.writeFileSync(
							path.join(programOpts.ios, plistFilenames[index]),
							plist.build(
								Object.assign(
									{},
									json,
									!programOpts.incrementBuild
										? {
												CFBundleShortVersionString: appPkg.version
											}
										: {},
									{
										CFBundleVersion: `${programOpts.resetBuild
											? 1
											: parseInt(json.CFBundleVersion, 10) + 1}`
									}
								)
							)
						);
					});

					plistFilenames.forEach((filename, index) => {
						const indent = detectIndent(plistFiles[index]);

						fs.writeFileSync(
							path.join(programOpts.ios, filename),
							stripIndents`
							<?xml version="1.0" encoding="UTF-8"?>
							<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
							<plist version="1.0">` +
								"\n" +
								beautify(
									fs
										.readFileSync(path.join(programOpts.ios, filename), "utf8")
										.match(/<dict>[\s\S]*<\/dict>/)[0],
									{
										end_with_newline: true,
										indent_char: indent.indent,
										indent_size: indent.amount
									}
								) +
								stripIndents`
							</plist>` +
								"\n"
						);
					});
				});

				xcode.save();
			}

			log({ text: "iOS updated" }, programOpts.quiet);
			resolve();
		});
	}

	return pSettle([android, ios].filter(Boolean))
		.then(function(result) {
			const errs = result
				.filter(function(item) {
					return item.isRejected;
				})
				.map(function(item) {
					return item.reason;
				});

			if (errs.length) {
				errs
					.reduce(function(a, b) {
						return a.concat(b);
					}, [])
					.forEach(function(err) {
						if (program.outputHelp) {
							log(err);
						}
					});

				if (program.outputHelp) {
					program.outputHelp();
				}

				throw errs
					.map(function(errGrp, index) {
						return errGrp
							.map(function(err) {
								return err.text;
							})
							.join(", ");
					})
					.join("; ");
			}

			const gitCmdOpts = {
				cwd: projPath
			};

			if (
				programOpts.amend ||
				(process.env.npm_lifecycle_event &&
					process.env.npm_lifecycle_event.indexOf("version") > -1 &&
					!programOpts.neverAmend)
			) {
				log({ text: "Amending..." }, programOpts.quiet);

				switch (process.env.npm_lifecycle_event) {
					case "version":
						child.spawnSync(
							"git",
							["add", programOpts.android, programOpts.ios],
							gitCmdOpts
						);

						break;

					case "postversion":
					default:
						child.execSync("git commit -a --amend --no-edit", gitCmdOpts);

						if (!programOpts.skipTag) {
							log({ text: "Adjusting Git tag..." }, programOpts.quiet);
							child.execSync(
								"git tag -f $(git tag --sort=v:refname | tail -1)",
								gitCmdOpts
							);
						}
				}
			}

			log(
				{
					style: "green",
					text: "Done"
				},
				programOpts.quiet
			);

			return child.execSync("git log -1 --pretty=%H", gitCmdOpts).toString();
		})
		.catch(function(err) {
			if (process.env.RNV_ENV === "ava") {
				console.error(err);
			}

			log({
				style: "red",
				text: "Done, with errors."
			});

			process.exit(1);
		});
}

module.exports = {
	getDefaults: getDefaults,
	version: version
};
