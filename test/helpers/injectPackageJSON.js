const apePackageJSON = require('../fixture/AwesomeProjectEssentials/package');
const fs = require('fs-extra');

/**
 * Saves a new package.json with injected scripts
 * @param {Object} t Test object
 * @param {Object} script npm scripts to merge
 */
function injectPackageJSON(t, script) {
	fs.writeFileSync('package.json', `${JSON.stringify(Object.assign({}, apePackageJSON, {
		scripts: Object.assign({}, apePackageJSON.scripts, script)
	}), null, 2)}\n`, {
		cwd: t.context.tempDir
	});
}

module.exports = injectPackageJSON;
