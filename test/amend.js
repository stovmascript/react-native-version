import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-a -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-a" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-a -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-a" },
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-a", "-L"],
	expected.version.default,
	expected.tree.amended
);

test("CLI", cliMacro, ["-a"], expected.version.default, expected.tree.amended);

test(
	"API (legacy)",
	apiMacro,
	{ amend: true, legacy: true },
	expected.version.default,
	expected.tree.amended
);

test(
	"API",
	apiMacro,
	{ amend: true },
	expected.version.default,
	expected.tree.amended
);
