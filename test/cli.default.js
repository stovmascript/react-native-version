import beforeEachCLI from "./helpers/beforeEachCLI";
import expectedTree from "./fixtures/tree";
import getCurrTree from "./helpers/getCurrTree";
import test from "ava";
import versionTempWithCLI from "./helpers/versionTempWithCLI";

test("CLI: default", async t => {
	beforeEachCLI(t);
	versionTempWithCLI();
	t.deepEqual(await getCurrTree(t), expectedTree.notAmended);
});
