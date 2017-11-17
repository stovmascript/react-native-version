import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-b -L" },
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-b" },
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-b -L" },
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-b" },
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-b", "-L"],
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"CLI",
	cliMacro,
	["-b"],
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ incrementBuild: true, legacy: true },
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"API",
	apiMacro,
	{ incrementBuild: true },
	expected.version.incrementBuild,
	expected.tree.notAmended
);
