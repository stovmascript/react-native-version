import {execAsync} from '../util';
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
	child.execSync(`
		git init \
		&& git config user.email "test@zor.arpa" \
		&& git config user.name "Test Zor" \
		&& git add . \
		&& git commit -m "Initial commit" \
		&& npm version ${newVersion || 'patch'} \
		`
	);
}

/**
 * Returns a filtered list of pathnames based on a supplied Git command
 * @param {string} cmd Git shell command which outputs parsable file paths
 * @param {Object} opts Child process options
 * @return {Array} List of pathnames
 */
async function gitPathnames(cmd, opts) {
	const result = await execAsync(cmd, opts);
	return result.split('\n').filter(Boolean);
}

/**
 * Returns the current Git tree pathnames
 * @param {Object} t Test object
 * @return {Object} head & index pathnames
 */
async function getCurrTree(t) {
	const childProcessOpts = {
		cwd: t.context.tempDir
	};

	const head = await gitPathnames('git show --name-only --pretty=', childProcessOpts);
	const index = await gitPathnames('git status -s | grep " M " | cut -c4-', childProcessOpts);

	return {
		head,
		index
	};
}

/**
 * Saves a new package.json with injected scripts
 * @param {Object} t Test object
 * @param {Object} script npm scripts to merge
 */
function injectPackageJSON(t, script) {
	fs.writeFileSync('package.json', `${JSON.stringify({
		...apePackageJSON,
		scripts: {
			...apePackageJSON.scripts,
			...script
		}
	}, null, 2)}\n`, {
		cwd: t.context.tempDir
	});
}

/**
 * Versions an APE copy using the CLI
 * @param {Array} params Child process params
 */
function tempVersionWithCLI(params) {
	child.spawnSync('node', [cliPath].concat(params).filter(Boolean));
}

/**
 * Returns a commit hash based on the latest tag
 * @param {Object} t Test Object
 * @return {string} Commit hash
 */
function getCurrTagHash(t) {
	return execAsync('git rev-list -n 1 $(git tag | tail -1)', {
		cwd: t.context.tempDir
	});
}

/**
 * Returns the latest commit hash
 * @param {Object} t Test Object
 * @return {string} Commit hash
 */
function getCurrCommitHash(t) {
	return execAsync('git rev-parse HEAD', {
		cwd: t.context.tempDir
	});
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

	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test('API: amend', async t => {
	tempInitAndVersion();

	await version({
		amend: true,
		cwd: t.context.tempDir
	});

	t.deepEqual(await getCurrTree(t), expectedTree.amended);
});

test('API: neverAmend', async t => {
	tempInitAndVersion();

	await version({
		cwd: t.context.tempDir,
		neverAmend: true
	});

	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test('CLI: default', async t => {
	tempInitAndVersion();
	tempVersionWithCLI();
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test('CLI: amend', async t => {
	tempInitAndVersion();
	tempVersionWithCLI(['-a']);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
});

test('CLI: neverAmend', async t => {
	tempInitAndVersion();
	tempVersionWithCLI(['-A']);
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test('version: default', async t => {
	injectPackageJSON(t, {version: `node ${cliPath}`});
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
});

test('version: amend', async t => {
	injectPackageJSON(t, {version: `node ${cliPath} -a`});
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
});

test('version: neverAmend', async t => {
	injectPackageJSON(t, {version: `node ${cliPath} -A`});
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test('postversion: default', async t => {
	injectPackageJSON(t, {postversion: `node ${cliPath}`});
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
});

test('postversion: amend', async t => {
	injectPackageJSON(t, {postversion: `node ${cliPath} -a`});
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.is(currTagHash, currCommitHash);
});

test('postversion: neverAmend', async t => {
	injectPackageJSON(t, {postversion: `node ${cliPath} -A`});
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});
