import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion: default, legacy",
	npmScriptsMacro,
	{ postversion: "-L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"postversion: default",
	npmScriptsMacro,
	{ postversion: "" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version: default, legacy",
	npmScriptsMacro,
	{ version: "-L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version: default",
	npmScriptsMacro,
	{ version: "" },
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI: default, legacy",
	cliMacro,
	["-L"],
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI: default",
	cliMacro,
	[],
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API: default, legacy",
	apiMacro,
	{ legacy: true },
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API: default",
	apiMacro,
	{},
	expected.version.default,
	expected.tree.notAmended
);
