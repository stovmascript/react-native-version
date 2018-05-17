import apiMacro from "./helpers/apiMacro";
import cliMacro from "./helpers/cliMacro";
import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion (legacy)",
	npmScriptsMacro,
	{ postversion: "-b -L" },
	"AwesomeProject",
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"postversion",
	npmScriptsMacro,
	{ postversion: "-b" },
	"AwesomeProject",
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"postversion (Expo)",
	npmScriptsMacro,
	{ postversion: "-b" },
	"my-new-project",
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"version (legacy)",
	npmScriptsMacro,
	{ version: "-b -L" },
	"AwesomeProject",
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"version",
	npmScriptsMacro,
	{ version: "-b" },
	"AwesomeProject",
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"version (Expo)",
	npmScriptsMacro,
	{ version: "-b" },
	"my-new-project",
	expected.version.incrementBuild,
	expected.tree.amended
);

test(
	"CLI (legacy)",
	cliMacro,
	["-b", "-L"],
	"AwesomeProject",
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"CLI",
	cliMacro,
	["-b"],
	"AwesomeProject",
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"CLI (Expo)",
	cliMacro,
	["-b"],
	"my-new-project",
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"API (legacy)",
	apiMacro,
	{ incrementBuild: true, legacy: true },
	"AwesomeProject",
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"API",
	apiMacro,
	{ incrementBuild: true },
	"AwesomeProject",
	expected.version.incrementBuild,
	expected.tree.notAmended
);

test(
	"API (Expo)",
	apiMacro,
	{ incrementBuild: true },
	"my-new-project",
	expected.version.incrementBuild,
	expected.tree.notAmended
);
