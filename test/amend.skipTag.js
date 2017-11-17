import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-a --skip-tag -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-a --skip-tag" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-a --skip-tag -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-a --skip-tag" },
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-a", "--skip-tag", "-L"],
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI",
	cliMacro,
	["-a", "--skip-tag"],
	expected.version.default,
	expected.tree.amended
);

test(
	"API (legacy)",
	apiMacro,
	{ amend: true, skipTag: true, legacy: true },
	expected.version.default,
	expected.tree.amended
);

test(
	"API",
	apiMacro,
	{ amend: true, skipTag: true },
	expected.version.default,
	expected.tree.amended
);
