import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion: resetBuild, legacy",
	npmScriptsMacro,
	{ postversion: "-r -L" },
	expected.version.resetBuild,
	expected.tree.resetBuild.amended
);

test(
	"postversion: resetBuild",
	npmScriptsMacro,
	{ postversion: "-r" },
	expected.version.resetBuild,
	expected.tree.resetBuild.amended
);

test(
	"version: resetBuild, legacy",
	npmScriptsMacro,
	{ version: "-r -L" },
	expected.version.resetBuild,
	expected.tree.resetBuild.amended
);

test(
	"version: resetBuild",
	npmScriptsMacro,
	{ version: "-r" },
	expected.version.resetBuild,
	expected.tree.resetBuild.amended
);

test(
	"CLI: resetBuild, legacy",
	cliMacro,
	["-r", "-L"],
	expected.version.resetBuild,
	expected.tree.resetBuild.notAmended
);

test(
	"CLI: resetBuild",
	cliMacro,
	["-r"],
	expected.version.resetBuild,
	expected.tree.resetBuild.notAmended
);

test(
	"API: resetBuild, legacy",
	apiMacro,
	{ resetBuild: true, legacy: true },
	expected.version.resetBuild,
	expected.tree.resetBuild.notAmended
);

test(
	"API: resetBuild",
	apiMacro,
	{ resetBuild: true },
	expected.version.resetBuild,
	expected.tree.resetBuild.notAmended
);
