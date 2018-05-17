import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-L" },
	"AwesomeProject",
	expected.version.default,
	expected.tree.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "" },
	"AwesomeProject",
	expected.version.default,
	expected.tree.amended
);

test(
	"postversion (Expo)",
	npmScriptsMacro,
	{ postversion: "" },
	"my-new-project",
	expected.version.default,
	expected.tree.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-L" },
	"AwesomeProject",
	expected.version.default,
	expected.tree.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "" },
	"AwesomeProject",
	expected.version.default,
	expected.tree.amended
);

test(
	"version (Expo)",
	npmScriptsMacro,
	{ version: "" },
	"my-new-project",
	expected.version.default,
	expected.tree.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-L"],
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI",
	cliMacro,
	[],
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"CLI (Expo)",
	cliMacro,
	[],
	"my-new-project",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ legacy: true },
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API",
	apiMacro,
	{},
	"AwesomeProject",
	expected.version.default,
	expected.tree.notAmended
);

test(
	"API (Expo)",
	apiMacro,
	{},
	"my-new-project",
	expected.version.default,
	expected.tree.notAmended
);
