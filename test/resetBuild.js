import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-r -L" },
	expected.version.resetBuild,
	expected.tree.resetBuild.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-r" },
	expected.version.resetBuild,
	expected.tree.resetBuild.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-r -L" },
	expected.version.resetBuild,
	expected.tree.resetBuild.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-r" },
	expected.version.resetBuild,
	expected.tree.resetBuild.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-r", "-L"],
	expected.version.resetBuild,
	expected.tree.resetBuild.notAmended
);

test(
	"CLI",
	cliMacro,
	["-r"],
	expected.version.resetBuild,
	expected.tree.resetBuild.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ resetBuild: true, legacy: true },
	expected.version.resetBuild,
	expected.tree.resetBuild.notAmended
);

test(
	"API",
	apiMacro,
	{ resetBuild: true },
	expected.version.resetBuild,
	expected.tree.resetBuild.notAmended
);
