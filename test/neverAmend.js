import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-A -L" },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-A" },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-A -L" },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-A" },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-A", "-L"],
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI",
	cliMacro,
	["-A"],
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ neverAmend: true, legacy: true },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API",
	apiMacro,
	{ neverAmend: true },
	expected.version.default,
	expected.tree.notAmended
);
