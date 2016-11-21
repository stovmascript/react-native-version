import {gitPathnames} from '../utils';
import {version} from '../';
import child from 'child_process';
import expectedTree from './fixture/tree';
import fs from 'fs-extra';
import temp from 'temp';
import test from 'ava';

temp.track();

/**
 * Returns the current Git tree pathnames
 * @param {Object} opts Child process options
 * @return {Object} head & index pathnames
 */
function getCurrTree(opts) {
	return {
		head: gitPathnames('git show --name-only --pretty=', opts),
		index: gitPathnames('git status -s | grep " M " | cut -c4-', opts)
	};
}

/* eslint-disable ava/no-skip-test */
test.beforeEach(t => {
	process.chdir(__dirname);
	t.context.tmpDir = temp.mkdirSync('rnv-');
	fs.copySync('fixture/AwesomeProjectEssentials', t.context.tmpDir);
	process.chdir(t.context.tmpDir);
	child.execSync('git init && git add . && git commit -m "Initial commit" && npm version patch');
});

test('API: default', async t => {
	await version({
		cwd: t.context.tmpDir
	});

	t.deepEqual(getCurrTree({cwd: t.context.tmpDir}), expectedTree.notAmended);
});

test('API: amend', async t => {
	await version({
		amend: true,
		cwd: t.context.tmpDir
	});

	t.deepEqual(getCurrTree({cwd: t.context.tmpDir}), expectedTree.amended);
});

test('API: neverAmend', async t => {
	await version({
		cwd: t.context.tmpDir,
		neverAmend: true
	});

	t.deepEqual(getCurrTree({cwd: t.context.tmpDir}), expectedTree.notAmended);
});
