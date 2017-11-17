import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "" },
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-L"],
	expected.version.default,
	expected.tree.notAmended
);

test("CLI", cliMacro, [], expected.version.default, expected.tree.notAmended);

test(
	"API (legacy)",
	apiMacro,
	{ legacy: true },
	expected.version.default,
	expected.tree.notAmended
);

test("API", apiMacro, {}, expected.version.default, expected.tree.notAmended);
