# react-native-version

Seamlessly shadows the behaviour of [`npm version`](https://docs.npmjs.com/cli/version).

## npm-scripts hook (automatic method)

### Setup

```shell
npm install react-native-version --save
```

Hook into the "postversion" npm script in your app's package.json:

```js
{
	"name": "AwesomeProject",
	"version": "0.0.1",
	"private": true,
	"scripts": {
		"start": "node node_modules/react-native/local-cli/cli.js start",
		"postversion": "react-native-version"
	},
	// ...
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
-h, --help                output usage information
-a, --amend               Amend the previous commit. This is done automatically when react-native-version is run from the "postversion" npm script. Use "--never-amend" if you never want to amend.
-A, --never-amend         Never amend the previous commit
-d, --android [path]      Path to your "app/build.gradle" file
-i, --ios [path]          Path to your "Info.plist" file
-t, --target <platforms>  Only version specified platforms, eg. "--target android,ios"
```

You can apply these options to the "postversion" script too. If for example you want to commit the changes made by RNV yourself, add the "--never-amend" option:

```js
{
	// ...
	"scripts": {
		"postversion": "react-native-version --never-amend"
	},
	// ...
}
```

## Targeting platforms

The default behaviour is to version all React Native platforms. You can target specific platforms by passing a comma-separated list to the "--target" option, or by using the `RNV` environment variable:

```shell
RNV=android,ios npm version patch
# or
RNV=android,ios react-native-version
```

When using the CLI, you can even combine both methods and make your teammates rage :smiling_imp: :suspect::

```shell
RNV=android react-native-version --target ios
```
:rage1: :speak_no_evil:

## See also

- [npm-version](https://docs.npmjs.com/cli/version)
- [Semantic Versioning (semver)](http://semver.org/)
