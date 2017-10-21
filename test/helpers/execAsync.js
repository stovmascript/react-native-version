const child = require("child_process");

/**
 * Promisified child_process.exec
 * @param {string} cmd child_process.exec command
 * @param {Object} opts child_process.exec options
 * @return {Promise} ChildProcess Promise object
 */
function execAsync(cmd, opts) {
	return new Promise(function(resolve, reject) {
		child.exec(cmd, opts, function(err, stdout) {
			if (err) {
				reject(err);
			} else {
				resolve(stdout.trim());
			}
		});
	})
		.then(function(result) {
			return result;
		})
		.catch(function(err) {
			console.log(err);
		});
}

module.exports = execAsync;
