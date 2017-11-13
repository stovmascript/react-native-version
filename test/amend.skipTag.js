import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion: amend, skipTag, legacy",
	npmScriptsMacro,
	{ postversion: "-a --skip-tag -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"postversion: amend, skipTag",
	npmScriptsMacro,
	{ postversion: "-a --skip-tag" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version: amend, skipTag, legacy",
	npmScriptsMacro,
	{ version: "-a --skip-tag -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version: amend, skipTag",
	npmScriptsMacro,
	{ version: "-a --skip-tag" },
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI: amend, skipTag, legacy",
	cliMacro,
	["-a", "--skip-tag", "-L"],
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI: amend, skipTag",
	cliMacro,
	["-a", "--skip-tag"],
	expected.version.default,
	expected.tree.amended
);

test(
	"API: amend, skipTag, legacy",
	apiMacro,
	{ amend: true, skipTag: true, legacy: true },
	expected.version.default,
	expected.tree.amended
);

test(
	"API: amend, skipTag",
	apiMacro,
	{ amend: true, skipTag: true },
	expected.version.default,
	expected.tree.amended
);
