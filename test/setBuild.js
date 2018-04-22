import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-s 33 -L" },
	expected.version.setBuild,
	expected.tree.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-s 33" },
	expected.version.setBuild,
	expected.tree.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-s 33 -L" },
	expected.version.setBuild,
	expected.tree.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-s 33" },
	expected.version.setBuild,
	expected.tree.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-s", "33", "-L"],
	expected.version.setBuild,
	expected.tree.notAmended
);

test(
	"CLI",
	cliMacro,
	["-s", "33"],
	expected.version.setBuild,
	expected.tree.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ setBuild: 33, legacy: true },
	expected.version.setBuild,
	expected.tree.notAmended
);

test(
	"API",
	apiMacro,
	{ setBuild: 33 },
	expected.version.setBuild,
	expected.tree.notAmended
);
