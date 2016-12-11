const execAsync = require('./execAsync');

/**
 * Returns the latest commit hash
 * @param {Object} t Test Object
 * @return {string} Commit hash
 */
function getCurrCommitHash(t) {
	return execAsync('git rev-parse HEAD', {
		cwd: t.context.tempDir
	});
}

module.exports = getCurrCommitHash;
