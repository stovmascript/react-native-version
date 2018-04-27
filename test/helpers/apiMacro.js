import beforeEach from "./beforeEach";
import getCurrCommitHash from "./getCurrCommitHash";
import getCurrTagHash from "./getCurrTagHash";
import getCurrTree from "./getCurrTree";
import getCurrVersion from "./getCurrVersion";
import tempInitAndVersion from "./tempInitAndVersion";
import { version } from "../../";

export default async (t, params, expectedVersion, expectedTree) => {
	beforeEach(t);
	tempInitAndVersion();
	await version(Object.assign({}, params, { quiet: true }), t.context.tempDir);
	t.deepEqual(getCurrVersion(t), expectedVersion);
	t.deepEqual(await getCurrTree(t), expectedTree);

	if (params.skipTag) {
		t.not(await getCurrTagHash(t), await getCurrCommitHash(t));
	} else {
		t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
	}
};
