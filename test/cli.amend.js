import beforeEachCLI from "./helpers/beforeEachCLI";
import expectedTree from "./fixtures/tree";
import getCurrCommitHash from "./helpers/getCurrCommitHash";
import getCurrTagHash from "./helpers/getCurrTagHash";
import getCurrTree from "./helpers/getCurrTree";
import test from "ava";
import versionTempWithCLI from "./helpers/versionTempWithCLI";

test("CLI: amend", async t => {
	beforeEachCLI(t);
	versionTempWithCLI(["-a"]);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.is(currTagHash, currCommitHash);
});
