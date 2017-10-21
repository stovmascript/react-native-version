const execAsync = require("./execAsync");

/**
 * Returns a commit hash based on the latest tag
 * @param {Object} t Test Object
 * @return {string} Commit hash
 */
function getCurrTagHash(t) {
	return execAsync("git rev-list -n 1 $(git tag --sort=v:refname | tail -1)", {
		cwd: t.context.tempDir
	});
}

module.exports = getCurrTagHash;
