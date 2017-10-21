const execAsync = require("./execAsync");

/**
 * Returns a filtered list of pathnames based on a supplied Git command
 * @param {string} cmd Git shell command which outputs parsable file paths
 * @param {Object} opts Child process options
 * @return {Array} List of pathnames
 */
function gitPathnames(cmd, opts) {
	return execAsync(cmd, opts).then(function(result) {
		return result.split("\n").filter(Boolean);
	});
}

module.exports = gitPathnames;
