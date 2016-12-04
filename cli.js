#!/usr/bin/env node

const list = require('./util').list;
const pkg = require('./package');
const program = require('commander');
const rnv = require('./');

const defaults = rnv.getDefaults();

program
.version(pkg.version)
/* eslint-disable max-len */
.option('-a, --amend', 'Amend the previous commit. Also updates the latest Git tag to point to the amended commit. This is done automatically when ' + pkg.name + ' is run from the "postversion" npm script. Use "--never-amend" if you never want to amend.')
.option('--skip-tag', 'For use with "--amend" if you don\'t want to update Git tags')
.option('-A, --never-amend', 'Never amend the previous commit')
.option('-b, --increment-build', 'Only increment build number')
.option('-d, --android [path]', 'Path to your "android/app/build.gradle" file', defaults.android)
.option('-i, --ios [path]', 'Path to your "ios/" folder', defaults.ios)
.option('-r, --reset-build', 'Reset build number back to "1" (iOS only). Unlike Android\'s "versionCode", iOS doesn\'t require you to bump the "CFBundleVersion", as long as "CFBundleShortVersionString" changes. To make it consistent across platforms, ' + pkg.name + ' bumps both by default. You can use this option if you prefer to reset the build number after every version change. If you then need to push another build under the same version, you can use "-bt ios".')
.option('-t, --target <platforms>', 'Only version specified platforms, eg. "--target android,ios"', list)
/* eslint-enable */
.parse(process.argv);

rnv.version(program);
