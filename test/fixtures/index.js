const tree = require("./tree");
const version = require("./version");

module.exports = {
	cliPath: require.resolve("../../cli"),
	tree,
	version
};
