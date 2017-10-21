import beforeEachCLI from "./helpers/beforeEachCLI";
import expectedTree from "./fixtures/tree";
import getCurrCommitHash from "./helpers/getCurrCommitHash";
import getCurrTagHash from "./helpers/getCurrTagHash";
import getCurrTree from "./helpers/getCurrTree";
import test from "ava";
import versionTempWithCLI from "./helpers/versionTempWithCLI";

test("CLI: amend, skipTag", async t => {
	beforeEachCLI(t);
	versionTempWithCLI(["-a", "--skip-tag"]);
	t.deepEqual(await getCurrTree(t), expectedTree.amended);

	const currTagHash = await getCurrTagHash(t);
	const currCommitHash = await getCurrCommitHash(t);

	t.not(currTagHash, currCommitHash);
});
