import beforeEach from "./helpers/beforeEach";
import expectedTree from "./fixtures/tree";
import getCurrCommitHash from "./helpers/getCurrCommitHash";
import getCurrTagHash from "./helpers/getCurrTagHash";
import getCurrTree from "./helpers/getCurrTree";
import injectPackageJSON from "./helpers/injectPackageJSON";
import tempInitAndVersion from "./helpers/tempInitAndVersion";
import test from "ava";
import { version } from "../";

const cliPath = require.resolve("../cli");

test.beforeEach(t => {
	beforeEach(t);
});

test("API: default", async t => {
	tempInitAndVersion();

	await version(
		{
			quiet: true
		},
		t.context.tempDir
	);

	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test("API: amend", async t => {
	tempInitAndVersion();

	await version(
		{
			amend: true,
			quiet: true
		},
		t.context.tempDir
	);

	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.is(currTagHash, currCommitHash);
});

test("API: amend, skipTag", async t => {
	tempInitAndVersion();

	await version(
		{
			amend: true,
			quiet: true,
			skipTag: true
		},
		t.context.tempDir
	);

	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.not(currTagHash, currCommitHash);
});

test("API: neverAmend", async t => {
	tempInitAndVersion();

	await version(
		{
			neverAmend: true,
			quiet: true
		},
		t.context.tempDir
	);

	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test("version: default", async t => {
	injectPackageJSON(t, { version: `node ${cliPath}` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.is(currTagHash, currCommitHash);
});

test("version: default, skipTag", async t => {
	injectPackageJSON(t, { version: `node ${cliPath} --skip-tag` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.is(currTagHash, currCommitHash);
});

test("version: amend", async t => {
	injectPackageJSON(t, { version: `node ${cliPath} -a` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.is(currTagHash, currCommitHash);
});

test("version: amend, skipTag", async t => {
	injectPackageJSON(t, { version: `node ${cliPath} -a --skip-tag` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.is(currTagHash, currCommitHash);
});

test("version: neverAmend", async t => {
	injectPackageJSON(t, { version: `node ${cliPath} -A` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test("postversion: default", async t => {
	injectPackageJSON(t, { postversion: `node ${cliPath}` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.is(currTagHash, currCommitHash);
});

test("postversion: default, skipTag", async t => {
	injectPackageJSON(t, { postversion: `node ${cliPath} --skip-tag` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.not(currTagHash, currCommitHash);
});

test("postversion: amend", async t => {
	injectPackageJSON(t, { postversion: `node ${cliPath} -a` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.is(currTagHash, currCommitHash);
});

test("postversion: amend, skipTag", async t => {
	injectPackageJSON(t, { postversion: `node ${cliPath} -a --skip-tag` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.not(currTagHash, currCommitHash);
});

test("postversion: neverAmend", async t => {
	injectPackageJSON(t, { postversion: `node ${cliPath} -A` });
	tempInitAndVersion();
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});
