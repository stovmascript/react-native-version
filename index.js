const child = require('child_process');
const fs = require('fs');
const path = require('path');
const plist = require('simple-plist');

const cwd = process.cwd();

const pkg = require(path.join(cwd, 'package'));

const iosFilePath = path.join(cwd, 'ios', pkg.name, 'Info.plist');
const iosFile = plist.readFileSync(iosFilePath);

iosFile.CFBundleShortVersionString = pkg.version;
plist.writeFileSync(iosFilePath, iosFile);

if (process.platform === 'darwin') {
	child.execSync('plutil -convert xml1 ' + iosFilePath);
}

const androidFilePath = path.join(cwd, 'android/app/build.gradle');
const androidFile = fs.readFileSync(androidFilePath, 'utf8');

const newAndroidFile = androidFile
.replace(/versionName "(.*)"/, 'versionName "' + pkg.version + '"')
.replace(/versionCode (\d+)/, function(match, cg1) {
	const newVersionCodeNumber = parseInt(cg1, 10) + 1;
	return 'versionCode ' + newVersionCodeNumber;
});

fs.writeFileSync(androidFilePath, newAndroidFile);

if (process.env.npm_lifecycle_event === 'postversion') {
	child.spawnSync('git', ['add', androidFilePath, iosFilePath]);
	child.execSync('git commit --amend --no-edit');
}
