const beautify = require("js-beautify").html;
const child = require("child_process");
const detectIndent = require("detect-indent");
const dottie = require("dottie");
const flattenDeep = require("lodash.flattendeep");
const fs = require("fs");
const list = require("./util").list;
const log = require("./util").log;
const path = require("path");
const plist = require("plist");
const pSettle = require("p-settle");
const resolveFrom = require("resolve-from");
const semver = require("semver");
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
 * @private
 * @return {Object} Defaults
 */
function getDefaults() {
	return {
		android: "android/app/build.gradle",
		ios: "ios"
	};
}

/**
 * Returns Info.plist filenames
 * @private
 * @param {Xcode} xcode Opened Xcode project file
 * @return {Array} Plist filenames
 */
function getPlistFilenames(xcode) {
	return unique(
		flattenDeep(
			xcode.document.projects.map(project => {
				return project.targets.filter(Boolean).map(target => {
					return target.buildConfigurationsList.buildConfigurations.map(
						config => {
							return config.ast.value.get("buildSettings").get("INFOPLIST_FILE")
								.text;
						}
					);
				});
			})
		)
	);
}

/**
 * Returns numerical version code for a given version name
 * @private
 * @return {Number} e.g. returns 1002003 for given version 1.2.3
 */
function generateVersionCode(versionName) {
	const major = semver.major(versionName);
	const minor = semver.minor(versionName);
	const patch = semver.patch(versionName);

	return 10 ** 6 * major + 10 ** 3 * minor + patch;
}

/**
 * Returns the new version code based on program options
 * @private
 * @return {Number} the new version code
 */
function getNewVersionCode(programOpts, versionCode, versionName, resetBuild) {
	if (resetBuild) {
		return 1;
	}

	if (programOpts.setBuild) {
		return programOpts.setBuild;
	}

	if (programOpts.generateBuild) {
		return generateVersionCode(versionName);
	}

	return versionCode ? versionCode + 1 : 1;
}

/**
 * CFBundleShortVersionString must be a string composed of three period-separated integers.
 * @private
 * @param {String} versionName The full version string
 * @return {String} e.g. returns '1.2.3' for given '1.2.3-beta.1'. Returns `versionName` if no match is found.
 */
function getCFBundleShortVersionString(versionName) {
	const match =
		versionName && typeof versionName === "string"
			? versionName.match(/\d*\.\d*.\d*/g)
			: [];
	return match && match[0] ? match[0] : versionName;
}

/**
 * Determines whether the project is an Expo app or a plain React Native app
 * @private
 * @return {Boolean} true if the project is an Expo app
 */
function isExpoProject(projPath) {
	try {
		let module = resolveFrom(projPath, "expo");
		let appInfo = require(`${projPath}/app.json`);

		return !!(module && appInfo.expo);
	} catch (err) {
		return false;
	}
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
	var appPkg;

	try {
		resolveFrom(projPath, "react-native");
		appPkg = require(path.join(projPath, "package.json"));
	} catch (err) {
		if (err.message === "Cannot find module 'react-native'") {
			log({
				style: "red",
				text: `Is this the right folder? ${err.message} in ${projPath}`
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

	var appJSON;
	const appJSONPath = path.join(projPath, "app.json");
	const isExpoApp = isExpoProject(projPath);

	isExpoApp && log({ text: "Expo detected" }, programOpts.quiet);

	try {
		appJSON = require(appJSONPath);

		if (isExpoApp && !programOpts.incrementBuild) {
			appJSON = Object.assign({}, appJSON, {
				expo: Object.assign({}, appJSON.expo, {
					version: appPkg.version
				})
			});
		}
	} catch (err) {}

	var android;
	var ios;

	if (!targets.length || targets.indexOf("android") > -1) {
		android = new Promise(function(resolve, reject) {
			log({ text: "Versioning Android..." }, programOpts.quiet);

			var gradleFile;

			try {
				gradleFile = fs.readFileSync(programOpts.android, "utf8");
			} catch (err) {
				isExpoApp ||
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

			if (!programOpts.incrementBuild && !isExpoApp) {
				gradleFile = gradleFile.replace(
					/versionName (["'])(.*)["']/,
					"versionName $1" + appPkg.version + "$1"
				);
			}

			if (!programOpts.neverIncrementBuild) {
				if (isExpoApp) {
					const versionCode = dottie.get(appJSON, "expo.android.versionCode");

					appJSON = Object.assign({}, appJSON, {
						expo: Object.assign({}, appJSON.expo, {
							android: Object.assign({}, appJSON.expo.android, {
								versionCode: getNewVersionCode(
									programOpts,
									versionCode,
									appPkg.version
								)
							})
						})
					});
				} else {
					gradleFile = gradleFile.replace(/versionCode (\d+)/, function(
						match,
						cg1
					) {
						const newVersionCodeNumber = getNewVersionCode(
							programOpts,
							parseInt(cg1, 10),
							appPkg.version
						);

						return "versionCode " + newVersionCodeNumber;
					});
				}
			}

			if (isExpoApp) {
				fs.writeFileSync(appJSONPath, JSON.stringify(appJSON, null, 2));
			} else {
				fs.writeFileSync(programOpts.android, gradleFile);
			}

			log({ text: "Android updated" }, programOpts.quiet);
			resolve();
		});
	}

	if (!targets.length || targets.indexOf("ios") > -1) {
		ios = new Promise(function(resolve, reject) {
			log({ text: "Versioning iOS..." }, programOpts.quiet);

			if (isExpoApp) {
				if (!programOpts.neverIncrementBuild) {
					const buildNumber = dottie.get(appJSON, "expo.ios.buildNumber");

					appJSON = Object.assign({}, appJSON, {
						expo: Object.assign({}, appJSON.expo, {
							ios: Object.assign({}, appJSON.expo.ios, {
								buildNumber: getNewVersionCode(
									programOpts,
									parseInt(buildNumber, 10),
									appPkg.version,
									programOpts.resetBuild
								).toString()
							})
						})
					});
				}

				fs.writeFileSync(appJSONPath, JSON.stringify(appJSON, null, 2));
			} else if (program.legacy) {
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
					const stdout = err.stdout.toString().trim();

					reject(
						stdout.indexOf("directory") > -1
							? [
									{
										style: "red",
										text: "No project folder found at " + programOpts.ios
									},
									{
										style: "yellow",
										text: 'Use the "--ios" option to specify the path manually'
									}
							  ]
							: [
									{
										style: "red",
										text: stdout
									}
							  ]
					);

					return;
				}

				if (!programOpts.incrementBuild) {
					child.spawnSync(
						"agvtool",
						["new-marketing-version", appPkg.version],
						agvtoolOpts
					);
				}

				if (!programOpts.neverIncrementBuild) {
					if (programOpts.resetBuild) {
						child.execSync("agvtool new-version -all 1", agvtoolOpts);
					} else {
						child.execSync("agvtool next-version -all", agvtoolOpts);
					}

					if (programOpts.generateBuild) {
						child.execSync(
							`agvtool new-version -all ${generateVersionCode(appPkg.version)}`,
							agvtoolOpts
						);
					}

					if (programOpts.setBuild) {
						child.execSync(
							`agvtool new-version -all ${program.setBuild}`,
							agvtoolOpts
						);
					}
				}
			} else {
				// Find any folder ending in .xcodeproj
				const xcodeProjects = fs
					.readdirSync(programOpts.ios)
					.filter(file => /\.xcodeproj$/i.test(file));

				if (xcodeProjects.length < 1) {
					throw new Error(`Xcode project not found in "${programOpts.ios}"`);
				}

				const projectFolder = path.join(programOpts.ios, xcodeProjects[0]);
				const xcode = Xcode.open(path.join(projectFolder, "project.pbxproj"));
				const plistFilenames = getPlistFilenames(xcode);

				xcode.document.projects.forEach(project => {
					!programOpts.neverIncrementBuild &&
						project.targets.filter(Boolean).forEach(target => {
							target.buildConfigurationsList.buildConfigurations.forEach(
								config => {
									if (target.name === appPkg.name) {
										const CURRENT_PROJECT_VERSION = getNewVersionCode(
											programOpts,
											parseInt(
												config.ast.value
													.get("buildSettings")
													.get("CURRENT_PROJECT_VERSION").text,
												10
											),
											appPkg.version,
											programOpts.resetBuild
										);

										config.patch({
											buildSettings: {
												CURRENT_PROJECT_VERSION
											}
										});
									}
								}
							);
						});

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
												CFBundleShortVersionString: getCFBundleShortVersionString(
													appPkg.version
												)
										  }
										: {},
									!programOpts.neverIncrementBuild
										? {
												CFBundleVersion: getNewVersionCode(
													programOpts,
													parseInt(json.CFBundleVersion, 10),
													appPkg.version,
													programOpts.resetBuild
												).toString()
										  }
										: {}
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
									Object.assign(
										{ end_with_newline: true },
										indent.type === "tab"
											? { indent_with_tabs: true }
											: { indent_size: indent.amount }
									)
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
							log(
								Object.assign({ style: "red", text: err.toString() }, err),
								programOpts.quiet
							);
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
				const latestTag =
					(programOpts.amend ||
						process.env.npm_config_git_tag_version ||
						process.env.npm_config_version_git_tag) &&
					!programOpts.skipTag &&
					semver.valid(
						semver.coerce(
							child
								.execSync("git log -1 --pretty=%s", gitCmdOpts)
								.toString()
								.trim()
						)
					) &&
					child
						.execSync("git describe --exact-match HEAD", gitCmdOpts)
						.toString()
						.trim();

				log({ text: "Amending..." }, programOpts.quiet);

				switch (process.env.npm_lifecycle_event) {
					case "version":
						child.spawnSync(
							"git",
							["add"].concat(
								isExpoApp ? appJSONPath : [programOpts.android, programOpts.ios]
							),
							gitCmdOpts
						);

						break;

					case "postversion":
					default:
						child.execSync("git commit -a --amend --no-edit", gitCmdOpts);

						if (latestTag) {
							log({ text: "Adjusting Git tag..." }, programOpts.quiet);

							child.execSync(
								`git tag -af ${latestTag} -m ${latestTag}`,
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

			if (programOpts.neverAmend) {
				return true;
			}

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
	getCFBundleShortVersionString: getCFBundleShortVersionString,
	getDefaults: getDefaults,
	getPlistFilenames: getPlistFilenames,
	isExpoProject: isExpoProject,
	version: version
};
