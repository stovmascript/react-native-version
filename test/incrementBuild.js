import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion: incrementBuild, legacy",
	npmScriptsMacro,
	{ postversion: "-b -L" },
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"postversion: incrementBuild",
	npmScriptsMacro,
	{ postversion: "-b" },
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"version: incrementBuild, legacy",
	npmScriptsMacro,
	{ version: "-b -L" },
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"version: incrementBuild",
	npmScriptsMacro,
	{ version: "-b" },
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"CLI: incrementBuild, legacy",
	cliMacro,
	["-b", "-L"],
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"CLI: incrementBuild",
	cliMacro,
	["-b"],
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"API: incrementBuild, legacy",
	apiMacro,
	{ incrementBuild: true, legacy: true },
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"API: incrementBuild",
	apiMacro,
	{ incrementBuild: true },
	expected.version.incrementBuild,
	expected.tree.notAmended
);
