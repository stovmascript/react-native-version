const child = require('child_process');

/**
 * Versions an APE copy using the CLI
 * @param {Array} params Child process params
 */
function versionTempWithCLI(params) {
	const versionProcess = child.spawnSync(
		'node',
		[require.resolve('../../cli')].concat(params).filter(Boolean)
	);

	if (versionProcess.status > 0) {
		throw new Error(versionProcess.stderr.toString());
	}
}

module.exports = versionTempWithCLI;
