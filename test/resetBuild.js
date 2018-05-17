import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-r -L" },
	"AwesomeProject",
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-r" },
	"AwesomeProject",
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	"postversion (Expo)",
	npmScriptsMacro,
	{ postversion: "-r" },
	"my-new-project",
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-r -L" },
	"AwesomeProject",
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-r" },
	"AwesomeProject",
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	"version (Expo)",
	npmScriptsMacro,
	{ version: "-r" },
	"my-new-project",
	expected.version.resetBuild,
	expected.tree.buildNumber.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-r", "-L"],
	"AwesomeProject",
	expected.version.resetBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"CLI",
	cliMacro,
	["-r"],
	"AwesomeProject",
	expected.version.resetBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"CLI (Expo)",
	cliMacro,
	["-r"],
	"my-new-project",
	expected.version.resetBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ resetBuild: true, legacy: true },
	"AwesomeProject",
	expected.version.resetBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"API",
	apiMacro,
	{ resetBuild: true },
	"AwesomeProject",
	expected.version.resetBuild,
	expected.tree.buildNumber.notAmended
);

test(
	"API (Expo)",
	apiMacro,
	{ resetBuild: true },
	"my-new-project",
	expected.version.resetBuild,
	expected.tree.buildNumber.notAmended
);
