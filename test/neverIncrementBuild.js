import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-B -L" },
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-B" },
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-B -L" },
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-B" },
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-B", "-L"],
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"CLI",
	cliMacro,
	["-B"],
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ neverIncrementBuild: true, legacy: true },
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"API",
	apiMacro,
	{ neverIncrementBuild: true },
	expected.version.neverIncrementBuild,
	expected.tree.buildNumber.notAmended
);
