const gitPathnames = require("./gitPathnames");

/**
 * Returns the current Git tree pathnames
 * @param {Object} t Test object
 * @return {Object} head & index pathnames
 */
function getCurrTree(t) {
	const childProcessOpts = {
		cwd: t.context.tempDir
	};

	return Promise.all([
		gitPathnames("git show --name-only --pretty=", childProcessOpts),
		gitPathnames('git status -s | grep " M " | cut -c4-', childProcessOpts)
	]).then(function(result) {
		return {
			head: result[0],
			index: result[1]
		};
	});
}

module.exports = getCurrTree;
