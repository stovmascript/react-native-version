import {gitPathnames} from '../utils';
import {version} from '../';
import apePackageJSON from './fixture/AwesomeProjectEssentials/package';
import child from 'child_process';
import expectedTree from './fixture/tree';
import fs from 'fs-extra';
import temp from 'temp';
import test from 'ava';

const cliPath = require.resolve('../cli');

temp.track();

/**
 * Inits and npm-versions an APE copy
 * @param {string} newVersion New version to pass to npm-version
 */
function tempInitAndVersion(newVersion) {
	child.execSync(
		`git init && git add . && git commit -m "Initial commit" && npm version ${(
			newVersion || 'patch'
		)}`
	);
}

/**
 * Returns the current Git tree pathnames
 * @param {Object} t Test object
 * @return {Object} head & index pathnames
 */
function getCurrTree(t) {
	const childProcessOpts = {
		cwd: t.context.tempDir
	};

	return {
		head: gitPathnames('git show --name-only --pretty=', childProcessOpts),
		index: gitPathnames('git status -s | grep " M " | cut -c4-', childProcessOpts)
	};
}

/**
 * Saves a new package.json with injected scripts
 * @param {Object} t Test object
 * @param {Object} script npm scripts to merge
 */
function injectPackageJSON(t, script) {
	fs.writeFileSync('package.json', JSON.stringify({
		...apePackageJSON,
		scripts: {
			...apePackageJSON.scripts,
			...script
		}
	}), {
		cwd: t.context.tempDir
	});
}

/**
 * Versions an APE copy using the CLI
 * @param {Object} t Test Object
 * @param {Array} params Child process params
 */
function tempVersionWithCLI(t, params) {
	child.spawnSync('node', [cliPath].concat(params).filter(Boolean));
}

test.beforeEach(t => {
	process.chdir(__dirname);
	t.context.tempDir = temp.mkdirSync('rnv-');
	fs.copySync('fixture/AwesomeProjectEssentials', t.context.tempDir);
	process.chdir(t.context.tempDir);
});

test('API: default', async t => {
	tempInitAndVersion();

	await version({
		cwd: t.context.tempDir
	});

	t.deepEqual(getCurrTree(t), expectedTree.notAmended);
});

test('API: amend', async t => {
	tempInitAndVersion();

	await version({
		amend: true,
		cwd: t.context.tempDir
	});

	t.deepEqual(getCurrTree(t), expectedTree.amended);
});

test('API: neverAmend', async t => {
	tempInitAndVersion();

	await version({
		cwd: t.context.tempDir,
		neverAmend: true
	});

	t.deepEqual(getCurrTree(t), expectedTree.notAmended);
});

test('CLI: default', async t => {
	tempInitAndVersion();
	tempVersionWithCLI(t);
	t.deepEqual(getCurrTree(t), expectedTree.notAmended);
});

test('CLI: amend', async t => {
	tempInitAndVersion();
	tempVersionWithCLI(t, ['-a']);
	t.deepEqual(getCurrTree(t), expectedTree.amended);
});

test('CLI: neverAmend', async t => {
	tempInitAndVersion();
	tempVersionWithCLI(t, ['-A']);
	t.deepEqual(getCurrTree(t), expectedTree.notAmended);
});

test('postversion: default', async t => {
	injectPackageJSON(t, {postversion: `node ${cliPath}`});
	tempInitAndVersion();
	t.deepEqual(getCurrTree(t), expectedTree.amended);
});

test('postversion: amend', async t => {
	injectPackageJSON(t, {postversion: `node ${cliPath} -a`});
	tempInitAndVersion();
	t.deepEqual(getCurrTree(t), expectedTree.amended);
});

test('postversion: neverAmend', async t => {
	injectPackageJSON(t, {postversion: `node ${cliPath} -A`});
	tempInitAndVersion();
	t.deepEqual(getCurrTree(t), expectedTree.notAmended);
});
