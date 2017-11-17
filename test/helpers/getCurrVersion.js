import { getDefaults, getPlistFilenames } from "../../";

import { Xcode } from "pbxproj-dom/xcode";
import flattenDeep from "lodash.flattendeep";
import fs from "fs";
import path from "path";
import plist from "plist";
import unique from "lodash.uniq";

export default t => {
	const paths = getDefaults();
	const pkg = require(path.join(t.context.tempDir, "package.json"));

	const xcode = Xcode.open(
		path.join(
			t.context.tempDir,
			paths.ios,
			`${pkg.name}.xcodeproj`,
			"project.pbxproj"
		)
	);

	const CFBundleShortVersionString = {};
	const CFBundleVersion = {};

	getPlistFilenames(xcode).forEach(filename => {
		const target = path.dirname(filename);

		const parsedPlist = plist.parse(
			fs.readFileSync(path.join(t.context.tempDir, paths.ios, filename), "utf8")
		);

		CFBundleShortVersionString[target] = parsedPlist.CFBundleShortVersionString;
		CFBundleVersion[target] = parsedPlist.CFBundleVersion;
	});

	const gradleFile = fs.readFileSync(
		path.join(t.context.tempDir, paths.android),
		"utf8"
	);

	return {
		CFBundleShortVersionString,
		CFBundleVersion,
		CURRENT_PROJECT_VERSION: unique(
			flattenDeep(
				xcode.document.projects.map(project => {
					return project.targets.map(target => {
						return target.buildConfigurationsList.buildConfigurations.map(
							config => {
								return (
									config.ast.value
										.get("buildSettings")
										.get("CURRENT_PROJECT_VERSION").text || []
								);
							}
						);
					});
				})
			)
		).reduce((total, curr, index, array) => {
			return `${parseInt(total) + parseInt(curr) / array.length}`;
		}),
		version: pkg.version,
		versionCode: gradleFile.match(/versionCode (\d+)/)[1],
		versionName: gradleFile.match(/versionName "(.*)"/)[1]
	};
};
