const chalk = require('chalk');
const child = require('child_process');
const fs = require('fs');
const list = require('./utils').list;
const path = require('path');

const cwd = process.cwd();

const appPkg = require(path.join(cwd, 'package.json'));

const env = {
	target: process.env.RNV && list(process.env.RNV)
};

const defaults = {
	android: path.join(cwd, 'android/app/build.gradle'),
	ios: path.join(cwd, 'ios')
};

/**
 * Versions your app.
 * @param  {object} program commander/CLI-style options, camelCased
 */
function version(program) {
	program.android = program.android || defaults.android;
	program.ios = program.ios || defaults.ios;

	const targets = []
	.concat(program.target, env.target)
	.filter(function(target) {
		return typeof target !== 'undefined';
	});

	const android = new Promise(function(resolve) {
		if (!targets.length || targets.indexOf('android') > -1) {
			fs.stat(program.android, function(err) {
				if (err) {
					console.log(chalk.red('No gradle file found at ' + program.android));

					console.log(chalk.yellow(
						'Use the "--android" option to specify the path manually'
					));

					program.outputHelp();
				} else {
					const androidFile = fs.readFileSync(program.android, 'utf8');
					var newAndroidFile = androidFile;

					if (!program.incrementBuild) {
						newAndroidFile = newAndroidFile.replace(
							/versionName "(.*)"/, 'versionName "' + appPkg.version + '"'
						);
					}

					newAndroidFile = newAndroidFile
					.replace(/versionCode (\d+)/, function(match, cg1) {
						const newVersionCodeNumber = parseInt(cg1, 10) + 1;
						return 'versionCode ' + newVersionCodeNumber;
					});

					fs.writeFileSync(program.android, newAndroidFile);
					resolve();
				}
			});
		}
	});

	const ios = new Promise(function(resolve) {
		if (!targets.length || targets.indexOf('ios') > -1) {
			fs.stat(program.ios, function(err) {
				if (err) {
					console.log(chalk.red('No project folder found at ' + program.ios));

					console.log(chalk.yellow(
						'Use the "--ios" option to specify the path manually'
					));

					program.outputHelp();
				} else {
					try {
						child.execSync('xcode-select --print-path', {
							stdio: ['ignore', 'ignore', 'pipe']
						});
					} catch (err) {
						console.log(chalk.red(err));

						console.log(chalk.yellow(
							'Looks like Xcode Command Line Tools aren\'t installed'
						));

						console.log('');
						console.log('  Install:');
						console.log('');
						console.log('    $ xcode-select --install');
						console.log('');
						process.exit(1);
					}

					const agvtoolOpts = {
						cwd: program.ios
					};

					try {
						child.execSync('agvtool what-version', agvtoolOpts);
					} catch (err) {
						console.log(chalk.red(err.stdout));
						process.exit(1);
					}

					if (!program.incrementBuild) {
						child.spawnSync(
							'agvtool', ['new-marketing-version', appPkg.version], agvtoolOpts
						);
					}

					if (program.resetBuild) {
						child.execSync('agvtool new-version -all 1', agvtoolOpts);
					} else {
						child.execSync('agvtool next-version -all', agvtoolOpts);
					}

					resolve();
				}
			});
		}
	});

	Promise
	.all([android, ios])
	.then(function() {
		if (
			program.amend
			|| process.env.npm_lifecycle_event === 'postversion' && !program.neverAmend
		) {
			child.spawnSync('git', ['add', program.android, program.ios]);
			child.execSync('git commit --amend --no-edit');
		}
	});
}

module.exports = {

	/**
	 * Returns default values for some options, namely android/ios file/folder paths
	 * @return {object} defaults
	 */
	getDefaults: function() {
		return defaults;
	},

	version: version

};
