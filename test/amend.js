import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion: amend, legacy",
	npmScriptsMacro,
	{ postversion: "-a -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"postversion: amend",
	npmScriptsMacro,
	{ postversion: "-a" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version: amend, legacy",
	npmScriptsMacro,
	{ version: "-a -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version: amend",
	npmScriptsMacro,
	{ version: "-a" },
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI: amend, legacy",
	cliMacro,
	["-a", "-L"],
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI: amend",
	cliMacro,
	["-a"],
	expected.version.default,
	expected.tree.amended
);

test(
	"API: amend, legacy",
	apiMacro,
	{ amend: true, legacy: true },
	expected.version.default,
	expected.tree.amended
);

test(
	"API: amend",
	apiMacro,
	{ amend: true },
	expected.version.default,
	expected.tree.amended
);
