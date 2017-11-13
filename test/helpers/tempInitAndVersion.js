import child from "child_process";

export default () => {
	child.execSync(`
		git init \
		&& git config user.email "test@zor.arpa" \
		&& git config user.name "Test Zor" \
		&& git add . \
		&& git commit -m "Initial commit" \
		&& npm version patch \
		`);
};
