# react-native-version

Seamlessly shadows the behaviour of [`npm version`]((https://docs.npmjs.com/cli/version).

## npm-scripts hook (automatic method)

### Setup

```shell
npm install react-native-version --save
```

Hook into the "postversion" npm script in your app's package.json:

```json
{
	"name": "AwesomeProject",
	"version": "0.0.1",
	"private": true,
	"scripts": {
		"start": "node node_modules/react-native/local-cli/cli.js start",
		"postversion": "react-native-version"
	},
	...
}
```

### Usage

Before you publish a new build of your app, run `npm version <newVersion>`.

react-native-version will then update your `android/` and `ios/` code and automatically amend the version bump commit created by `npm version`. This method should be useful for most cases. If you need more control, take a look at the CLI and options below.

## CLI

### Setup

```shell
npm install -g react-native-version
```

### Example

```shell
cd AwesomeProject/
npm version patch
react-native-version
```

## Options

```
-h, --help            output usage information
-a, --amend           Amend the previous commit. This is done automatically when react-native-version is run from the "postversion" npm script. Use "--no-amend" if you never want to amend.
-A, --no-amend        Never amend the previous commit
-d, --android [path]  Path to your "app/build.gradle" file
-i, --ios [path]      Path to your "Info.plist" file
```

You can apply these options to the "postversion" script too. If for example you want to commit the changes made by RNV yourself, add the "--no-amend" option:

```json
{
	...
	"scripts": {
		"postversion": "react-native-version --no-amend"
	},
	...
}
```

## See also

- [npm-version](https://docs.npmjs.com/cli/version)
- [Semantic Versioning (semver)](http://semver.org/)
