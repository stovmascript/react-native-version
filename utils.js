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
 * Returns a filtered list of pathnames based on a supplied Git command
 * @param {string} cmd Git shell command which outputs parsable file paths
 * @param {Object} opts Child process options
 * @return {Array} List of pathnames
 */
function gitPathnames(cmd, opts) {
	return child.execSync(cmd, opts).toString().split('\n').filter(Boolean);
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

	gitPathnames: gitPathnames,
	log: log

};
