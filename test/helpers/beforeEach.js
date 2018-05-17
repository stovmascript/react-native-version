const fs = require("fs-extra");
const path = require("path");
const temp = require("temp");

temp.track();

module.exports = function(t) {
	t.context.tempDir = temp.mkdirSync("rnv-");

	fs.copySync(
		path.join(__dirname, "../fixtures", t.context.testProject),
		t.context.tempDir
	);

	process.chdir(t.context.tempDir);
};
