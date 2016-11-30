const chalk = require('chalk');
const child = require('child_process');

/**
 * Logs a message into the console with style
 * @param {Object} msg Object containing the message text and chalk style
 */
function log(msg) {
	console.log(chalk[msg.style || 'reset'](msg.text));
}

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

module.exports = {

	/**
	 * Splits list items in comma-separated lists
	 * @param {string} val Comma-separated list
	 * @return {Array} List items
	 */
	list: function(val) {
		return val.split(',');
	},

	execAsync: execAsync,
	log: log

};
