import expected from "./fixtures";
import npmScriptsMacro from "./helpers/npmScriptsMacro";
import test from "ava";

test(
	"postversion: default, skipTag, legacy",
	npmScriptsMacro,
	{ postversion: "--skip-tag -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"postversion: default, skipTag",
	npmScriptsMacro,
	{ postversion: "--skip-tag" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version: default, skipTag, legacy",
	npmScriptsMacro,
	{ version: "--skip-tag -L" },
	expected.version.default,
	expected.tree.amended
);

test(
	"version: default, skipTag",
	npmScriptsMacro,
	{ version: "--skip-tag" },
	expected.version.default,
	expected.tree.amended
);
