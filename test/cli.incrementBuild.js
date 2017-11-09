import beforeEachCLI from "./helpers/beforeEachCLI";
import expectedTree from "./fixtures/tree";
import expectedVersion from "./fixtures/version";
import getCurrTree from "./helpers/getCurrTree";
import getCurrVersion from "./helpers/getCurrVersion";
import test from "ava";
import versionTempWithCLI from "./helpers/versionTempWithCLI";

test("CLI: incrementBuild", async t => {
	beforeEachCLI(t);
	versionTempWithCLI(["-b"]);
	t.deepEqual(getCurrVersion(t), expectedVersion.incrementBuild);
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});
