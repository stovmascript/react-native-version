import beforeEach from "./beforeEach";
import { cliPath } from "../fixtures";
import fs from "fs-extra";
import getCurrCommitHash from "./getCurrCommitHash";
import getCurrTagHash from "./getCurrTagHash";
import getCurrTree from "./getCurrTree";
import getCurrVersion from "./getCurrVersion";
import tempInitAndVersion from "./tempInitAndVersion";
import testPkgJSON from "../fixtures/AwesomeProjectEssentials/package";

export default async (t, script, version, tree) => {
	beforeEach(t);

	const newScript = {};

	Object.keys(script).forEach(key => {
		newScript[key] = `${cliPath} ${script[key]}`;
	});

	const newTestPkgJSON = JSON.stringify(
		Object.assign({}, testPkgJSON, {
			scripts: Object.assign({}, testPkgJSON.scripts, newScript)
		}),
		null,
		2
	);

	fs.writeFileSync("package.json", `${newTestPkgJSON}\n`, {
		cwd: t.context.tempDir
	});

	tempInitAndVersion();
	t.deepEqual(getCurrVersion(t), version);
	t.deepEqual(await getCurrTree(t), tree);

	if (!script.version && newTestPkgJSON.indexOf("--skip-tag") > -1) {
		t.not(await getCurrTagHash(t), await getCurrCommitHash(t));
	} else {
		t.is(await getCurrTagHash(t), await getCurrCommitHash(t));
	}
};
