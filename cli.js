#!/usr/bin/env node
const list = require('./utils').list;
const pkg = require('./package');
const program = require('commander');
const rnv = require('./');

const defaults = rnv.getDefaults();

program
/* eslint-disable max-len */
.option('-a, --amend', 'Amend the previous commit. This is done automatically when ' + pkg.name + ' is run from the "postversion" npm script. Use "--never-amend" if you never want to amend.')
.option('-A, --never-amend', 'Never amend the previous commit')
.option('-b, --increment-build', 'Only increment build number')
.option('-d, --android [path]', 'Path to your "android/app/build.gradle" file', defaults.android)
.option('-i, --ios [path]', 'Path to your "ios/" folder', defaults.ios)
.option('-r, --reset-build', 'Reset build number back to "1" (iOS only)')
.option('-t, --target <platforms>', 'Only version specified platforms, eg. "--target android,ios"', list)
/* eslint-enable max-len */
.parse(process.argv);

rnv.version(program);
