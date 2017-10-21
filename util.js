const chalk = require("chalk");

/**
 * Splits list items in comma-separated lists
 * @param {string} val Comma-separated list
 * @return {Array} List items
 */
function list(val) {
	return val.split(",");
}

/**
 * Logs a message into the console with style
 * @param {Object} msg Object containing the message text and chalk style
 * @param {boolean} silent Whether log should be quiet
 */
function log(msg, silent) {
	if (!silent) {
		console.log("[RNV]", chalk[msg.style || "reset"](msg.text));
	}
}

module.exports = {
	list: list,
	log: log
};
