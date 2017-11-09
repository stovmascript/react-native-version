import beforeEach from "./helpers/beforeEach";
import expectedTree from "./fixtures/tree";
import expectedVersion from "./fixtures/version";
import getCurrCommitHash from "./helpers/getCurrCommitHash";
import getCurrTagHash from "./helpers/getCurrTagHash";
import getCurrTree from "./helpers/getCurrTree";
import getCurrVersion from "./helpers/getCurrVersion";
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

	t.deepEqual(getCurrVersion(t), expectedVersion.default);
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

	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
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

	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.not(await getCurrTagHash(t), await getCurrCommitHash(t));
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

	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test("API: incrementBuild", async t => {
	tempInitAndVersion();

	await version(
		{
			incrementBuild: true,
			quiet: true
		},
		t.context.tempDir
	);

	t.deepEqual(getCurrVersion(t), expectedVersion.incrementBuild);
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test("API: resetBuild", async t => {
	tempInitAndVersion();

	await version(
		{
			quiet: true,
			resetBuild: true
		},
		t.context.tempDir
	);

	t.deepEqual(getCurrVersion(t), expectedVersion.resetBuild);
	t.deepEqual(await getCurrTree(t), expectedTree.resetBuild.notAmended);
});

test("version: default", async t => {
	injectPackageJSON(t, { version: `${cliPath}` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("version: default, skipTag", async t => {
	injectPackageJSON(t, { version: `${cliPath} --skip-tag` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("version: amend", async t => {
	injectPackageJSON(t, { version: `${cliPath} -a` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("version: amend, skipTag", async t => {
	injectPackageJSON(t, { version: `${cliPath} -a --skip-tag` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("version: neverAmend", async t => {
	injectPackageJSON(t, { version: `${cliPath} -A` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test("version: incrementBuild", async t => {
	injectPackageJSON(t, { version: `${cliPath} -b` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.incrementBuild);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("version: resetBuild", async t => {
	injectPackageJSON(t, { version: `${cliPath} -r` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.resetBuild);
	t.deepEqual(await getCurrTree(t), expectedTree.resetBuild.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("postversion: default", async t => {
	injectPackageJSON(t, { postversion: `${cliPath}` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("postversion: default, skipTag", async t => {
	injectPackageJSON(t, { postversion: `${cliPath} --skip-tag` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.not(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("postversion: amend", async t => {
	injectPackageJSON(t, { postversion: `${cliPath} -a` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("postversion: amend, skipTag", async t => {
	injectPackageJSON(t, { postversion: `${cliPath} -a --skip-tag` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.not(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("postversion: neverAmend", async t => {
	injectPackageJSON(t, { postversion: `${cliPath} -A` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.default);
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});

test("postversion: incrementBuild", async t => {
	injectPackageJSON(t, { postversion: `${cliPath} -b` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.incrementBuild);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});

test("postversion: resetBuild", async t => {
	injectPackageJSON(t, { postversion: `${cliPath} -r` });
	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), expectedVersion.resetBuild);
	t.deepEqual(await getCurrTree(t), expectedTree.resetBuild.amended);
	t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
});
