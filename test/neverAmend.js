import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-A -L" },
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-A" },
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"postversion (Expo)",
	npmScriptsMacro,
	{ postversion: "-A" },
	"my-new-project",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-A -L" },
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-A" },
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"version (Expo)",
	npmScriptsMacro,
	{ version: "-A" },
	"my-new-project",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-A", "-L"],
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI",
	cliMacro,
	["-A"],
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI (Expo)",
	cliMacro,
	["-A"],
	"my-new-project",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ neverAmend: true, legacy: true },
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API",
	apiMacro,
	{ neverAmend: true },
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API (Expo)",
	apiMacro,
	{ neverAmend: true },
	"my-new-project",
	expected.version.default,
	expected.tree.notAmended
);
