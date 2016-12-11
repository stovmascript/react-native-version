const child = require('child_process');
const fs = require('fs');
const list = require('./util').list;
const log = require('./util').log;
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
	.filter(Boolean);

	const appPkg = require(path.join(programOpts.cwd, 'package.json'));
	var android;
	var ios;

	if (!targets.length || targets.indexOf('android') > -1) {
		android = new Promise(function(resolve, reject) {
			var gradleFile;

			try {
				gradleFile = fs.readFileSync(programOpts.android, 'utf8');
			} catch (err) {
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
			}

			if (!programOpts.incrementBuild) {
				gradleFile = gradleFile.replace(
					/versionName "(.*)"/, 'versionName "' + appPkg.version + '"'
				);
			}

			gradleFile = gradleFile
			.replace(/versionCode (\d+)/, function(match, cg1) {
				const newVersionCodeNumber = parseInt(cg1, 10) + 1;
				return 'versionCode ' + newVersionCodeNumber;
			});

			fs.writeFileSync(programOpts.android, gradleFile);
			resolve();
		});
	}

	if (!targets.length || targets.indexOf('ios') > -1) {
		ios = new Promise(function(resolve, reject) {
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

				return;
			}

			const agvtoolOpts = {
				cwd: programOpts.ios
			};

			try {
				child.execSync('agvtool what-version', agvtoolOpts);
			} catch (err) {
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

				return;
			}

			if (!programOpts.incrementBuild) {
				child.spawnSync('agvtool', ['new-marketing-version', appPkg.version], agvtoolOpts);
			}

			if (programOpts.resetBuild) {
				child.execSync('agvtool new-version -all 1', agvtoolOpts);
			} else {
				child.execSync('agvtool next-version -all', agvtoolOpts);
			}

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
			.forEach(err => {
				if (program.outputHelp) {
					log(err);
				}
			});

			if (program.outputHelp) {
				program.outputHelp();
			}

			throw errs.map(function(errGrp, index) {
				return errGrp.map(function(err) {
					return err.text;
				}).join(', ');
			}).join('; ');
		}

		const gitCmdOpts = {
			cwd: programOpts.cwd
		};

		if (
			programOpts.amend
			|| process.env.npm_lifecycle_event
			&& process.env.npm_lifecycle_event.indexOf('version') > -1
			&& !programOpts.neverAmend
		) {
			switch (process.env.npm_lifecycle_event) {
				case 'version':
					child.spawnSync('git', ['add', program.android, program.ios], gitCmdOpts);
					break;

				case 'postversion':
				default:
					child.execSync('git commit -a --amend --no-edit', gitCmdOpts);

					if (!program.skipTag) {
						child.execSync('git tag -f $(git tag | tail -1)', gitCmdOpts);
					}
			}
		}

		return child.execSync('git log -1 --pretty=%H', gitCmdOpts).toString();
	})
	.catch(function(err) {
		if (process.env.RNV_ENV === 'ava') {
			console.error(err);
		}

		process.exit(1);
	});
}

module.exports = {
	getDefaults: getDefaults,
	version: version
};
