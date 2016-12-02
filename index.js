const child = require('child_process');
const fs = require('fs');
const list = require('./utils').list;
const log = require('./utils').log;
const path = require('path');
const pSettle = require('p-settle');

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
	const cwd = process.cwd();

	return {
		android: path.join(cwd, 'android/app/build.gradle'),
		cwd: cwd,
		ios: path.join(cwd, 'ios')
	};
}

/**
 * Versions your app
 * @param {Object} program commander/CLI-style options, camelCased
 * @return {Promise<string|Error>} A promise which resolves with the last commit hash
 */
function version(program) {
	const programOpts = Object.assign({}, getDefaults(), program);

	const targets = []
	.concat(programOpts.target, env.target)
	.filter(function(target) {
		return typeof target !== 'undefined';
	});

	const appPkg = require(path.join(programOpts.cwd, 'package.json'));

	const android = new Promise(function(resolve, reject) {
		if (!targets.length || targets.indexOf('android') > -1) {
			fs.stat(programOpts.android, function(err) {
				if (err) {
					reject([
						{
							style: 'red',
							text: 'No gradle file found at ' + programOpts.android
						},
						{
							style: 'yellow',
							text: 'Use the "--android" option to specify the path manually'
						}
					]);
				} else {
					const androidFile = fs.readFileSync(programOpts.android, 'utf8');
					var newAndroidFile = androidFile;

					if (!programOpts.incrementBuild) {
						newAndroidFile = newAndroidFile.replace(
							/versionName "(.*)"/, 'versionName "' + appPkg.version + '"'
						);
					}

					newAndroidFile = newAndroidFile
					.replace(/versionCode (\d+)/, function(match, cg1) {
						const newVersionCodeNumber = parseInt(cg1, 10) + 1;
						return 'versionCode ' + newVersionCodeNumber;
					});

					fs.writeFileSync(programOpts.android, newAndroidFile);
					resolve();
				}
			});
		}
	});

	const ios = new Promise(function(resolve, reject) {
		if (!targets.length || targets.indexOf('ios') > -1) {
			fs.stat(programOpts.ios, function(err) {
				if (err) {
					reject([
						{
							style: 'red',
							text: 'No project folder found at ' + programOpts.ios
						},
						{
							style: 'yellow',
							text: 'Use the "--ios" option to specify the path manually'
						}
					]);
				} else {
					try {
						child.execSync('xcode-select --print-path', {
							stdio: ['ignore', 'ignore', 'pipe']
						});
					} catch (err) {
						reject([
							{
								style: 'red',
								text: err
							},
							{
								style: 'yellow',
								text: 'Looks like Xcode Command Line Tools aren\'t installed'
							},
							{
								text: '\n  Install:\n\n    $ xcode-select --install\n'
							}
						]);
					}

					const agvtoolOpts = {
						cwd: programOpts.ios
					};

					try {
						child.execSync('agvtool what-version', agvtoolOpts);
					} catch (err) {
						reject({
							style: 'red',
							text: err.stdout
						});
					}

					if (!programOpts.incrementBuild) {
						child.spawnSync(
							'agvtool', ['new-marketing-version', appPkg.version], agvtoolOpts
						);
					}

					if (programOpts.resetBuild) {
						child.execSync('agvtool new-version -all 1', agvtoolOpts);
					} else {
						child.execSync('agvtool next-version -all', agvtoolOpts);
					}

					resolve();
				}
			});
		}
	});

	return pSettle([android, ios]).then(function(result) {
		const errs = result
		.filter(function(err) {
			return err.reason;
		})
		.map(function(err) {
			return err.reason;
		});

		if (errs.length) {
			errs
			.reduce(function(a, b) {
				return a.concat(b);
			}, [])
			.forEach(err => {
				if (program.outputHelp) {
					log(err);
				}
			});

			if (program.outputHelp) {
				program.outputHelp();
			}

			throw new Error('╻\n┏━━━━━━━━┛\n╹\n' + errs.map(function(errGrp, index) {
				return errGrp.map(function(err) {
					return err.text;
				}).join('\n');
			}).join('\n'));
		}

		const gitCmdOpts = {
			cwd: programOpts.cwd
		};

		if (
			programOpts.amend
			|| process.env.npm_lifecycle_event.indexOf('version') > -1 && !programOpts.neverAmend
		) {
			switch (process.env.npm_lifecycle_event) {
				case 'version':
					child.spawnSync('git', ['add', program.android, program.ios], gitCmdOpts);
					break;

				case 'postversion':
				default:
					child.execSync(
						'git commit -a --amend --no-edit && git tag -f $(git tag | tail -1)',
						gitCmdOpts
					);
			}
		}

		return child.execSync('git log -1 --pretty=%H', gitCmdOpts).toString();
	});
}

module.exports = {
	getDefaults: getDefaults,
	version: version
};
