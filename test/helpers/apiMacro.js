import beforeEach from "./beforeEach";
import getCurrTree from "./getCurrTree";
import getCurrVersion from "./getCurrVersion";
import tempInitAndVersion from "./tempInitAndVersion";
import { version } from "../../";

export default async (t, params, expectedVersion, tree) => {
	beforeEach(t);
	tempInitAndVersion();
	await version(Object.assign({}, params, { quiet: true }), t.context.tempDir);
	t.deepEqual(getCurrVersion(t), expectedVersion);
	t.deepEqual(await getCurrTree(t), tree);
};
