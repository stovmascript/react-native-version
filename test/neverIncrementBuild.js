import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-B -L" },
	"AwesomeProject",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-B" },
	"AwesomeProject",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"postversion (Expo)",
	npmScriptsMacro,
	{ postversion: "-B" },
	"my-new-project",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-B -L" },
	"AwesomeProject",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-B" },
	"AwesomeProject",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"version (Expo)",
	npmScriptsMacro,
	{ version: "-B" },
	"my-new-project",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-B", "-L"],
	"AwesomeProject",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"CLI",
	cliMacro,
	["-B"],
	"AwesomeProject",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"CLI (Expo)",
	cliMacro,
	["-B"],
	"my-new-project",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ neverIncrementBuild: true, legacy: true },
	"AwesomeProject",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"API",
	apiMacro,
	{ neverIncrementBuild: true },
	"AwesomeProject",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"API (Expo)",
	apiMacro,
	{ neverIncrementBuild: true },
	"my-new-project",
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);
