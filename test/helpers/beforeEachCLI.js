const beforeEach = require("./beforeEach");
const tempInitAndVersion = require("./tempInitAndVersion");

module.exports = function(t) {
	beforeEach(t);
	delete process.env.npm_lifecycle_event;
	tempInitAndVersion();
};
