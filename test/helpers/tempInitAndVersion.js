const child = require('child_process');

/**
 * Inits and npm-versions an APE copy
 * @param {string} newVersion New version to pass to npm-version
 */
function tempInitAndVersion(newVersion) {
	child.execSync(`
		git init \
		&& git config user.email "test@zor.arpa" \
		&& git config user.name "Test Zor" \
		&& git add . \
		&& git commit -m "Initial commit" \
		&& npm version ${newVersion || 'patch'} \
		`
	);
}

module.exports = tempInitAndVersion;
