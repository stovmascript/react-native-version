import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion: neverAmend, legacy",
	npmScriptsMacro,
	{ postversion: "-A -L" },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"postversion: neverAmend",
	npmScriptsMacro,
	{ postversion: "-A" },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"version: neverAmend, legacy",
	npmScriptsMacro,
	{ version: "-A -L" },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"version: neverAmend",
	npmScriptsMacro,
	{ version: "-A" },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI: neverAmend, legacy",
	cliMacro,
	["-A", "-L"],
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI: neverAmend",
	cliMacro,
	["-A"],
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API: neverAmend, legacy",
	apiMacro,
	{ neverAmend: true, legacy: true },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API: neverAmend",
	apiMacro,
	{ neverAmend: true },
	expected.version.default,
	expected.tree.notAmended
);
