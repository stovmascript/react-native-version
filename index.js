#!/usr/bin/env node

const chalk = require('chalk');
const child = require('child_process');
const fs = require('fs');
const path = require('path');
const pkg = require('./package');
const plist = require('simple-plist');
const program = require('commander');

const cwd = process.cwd();

const appPkg = require(path.join(cwd, 'package.json'));

/**
 * Splits list items in comma-separated lists
 * @param  {string} val comma-separated list
 * @return {array}      list items
 */
function list(val) {
	return val.split(',');
}

program
/* eslint-disable max-len */
.option('-a, --amend', 'Amend the previous commit. This is done automatically when ' + pkg.name + ' is run from the "postversion" npm script. Use "--never-amend" if you never want to amend.')
.option('-A, --never-amend', 'Never amend the previous commit')
.option('-d, --android [path]', 'Path to your "app/build.gradle" file', path.join(cwd, 'android/app/build.gradle'))
.option('-i, --ios [path]', 'Path to your "Info.plist" file', path.join(cwd, 'ios', appPkg.name, 'Info.plist'))
.option('-t, --target <platforms>', 'Only version specified platforms, eg. "--target android,ios"', list)
/* eslint-enable max-len */
.parse(process.argv);

/**
 * Amends previous commit with changed gradle and plist files
 */
function amend() {
	if (program.amend || process.env.npm_lifecycle_event === 'postversion' && !program.neverAmend) {
		child.spawnSync('git', ['add', program.android, program.ios]);
		child.execSync('git commit --amend --no-edit');
	}
}

const env = {
	target: process.env.RNV && list(process.env.RNV)
};

const targets = []
.concat(program.target, env.target)
.filter(function(target) {
	return typeof target !== 'undefined';
});

if (!targets.length || targets.indexOf('android') > -1) {
	fs.stat(program.android, function(err, stats) {
		if (err) {
			console.log(chalk.red('No file found at ' + program.android));
			console.log(chalk.yellow('Use the "--android" option to specify the path manually'));
			program.outputHelp();
		} else {
			const androidFile = fs.readFileSync(program.android, 'utf8');

			const newAndroidFile = androidFile
			.replace(/versionName "(.*)"/, 'versionName "' + appPkg.version + '"')
			.replace(/versionCode (\d+)/, function(match, cg1) {
				const newVersionCodeNumber = parseInt(cg1, 10) + 1;
				return 'versionCode ' + newVersionCodeNumber;
			});

			fs.writeFileSync(program.android, newAndroidFile);
			amend();
		}
	});
}

if (!targets.length || targets.indexOf('ios') > -1) {
	fs.stat(program.ios, function(err, stats) {
		if (err) {
			console.log(chalk.red('No file found at ' + program.ios));
			console.log(chalk.yellow('Use the "--ios" option to specify the path manually'));
			program.outputHelp();
		} else {
			const iosFile = plist.readFileSync(program.ios);

			iosFile.CFBundleShortVersionString = appPkg.version;
			plist.writeFileSync(program.ios, iosFile);

			if (process.platform === 'darwin') {
				child.execSync('plutil -convert xml1 ' + program.ios);
			}

			amend();
		}
	});
}
