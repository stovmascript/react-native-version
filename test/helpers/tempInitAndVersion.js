import child from "child_process";

/**
 * Inits and npm-versions an APE copy
 */
function tempInitAndVersion() {
	child.execSync(`
		git init \
		&& git config user.email "test@zor.arpa" \
		&& git config user.name "Test Zor" \
		&& git add . \
		&& git commit -m "Initial commit" \
		&& npm version patch \
		`);
}

module.exports = tempInitAndVersion;
