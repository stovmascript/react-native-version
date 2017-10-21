import beforeEachCLI from "./helpers/beforeEachCLI";
import expectedTree from "./fixtures/tree";
import getCurrTree from "./helpers/getCurrTree";
import test from "ava";
import versionTempWithCLI from "./helpers/versionTempWithCLI";

test("CLI: neverAmend", async t => {
	beforeEachCLI(t);
	versionTempWithCLI(["-A"]);
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});
