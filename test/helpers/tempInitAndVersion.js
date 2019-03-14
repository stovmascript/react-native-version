import child from "child_process";
import { oneLine } from "common-tags";

export default () => {
	child.execSync(oneLine`
		git init
		&& git config user.email "test@zor.arpa"
		&& git config user.name "Test Zor"
		&& git add .
		&& git commit -m "Initial commit"
		&& npm config set scripts-prepend-node-path true
		&& npm version major --ignore-scripts
		&& npm version major --ignore-scripts
		&& npm version major --ignore-scripts
		&& git checkout -q v2.0.0
		&& npm version patch -m "chore(release): bump to version %s"
		`);
};
