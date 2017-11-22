# react-native-version [![Build Status](https://travis-ci.org/stovmascript/react-native-version.svg?branch=master)](https://travis-ci.org/stovmascript/react-native-version) [![npm](https://img.shields.io/npm/v/react-native-version.svg)](https://www.npmjs.com/package/react-native-version) [![npm](https://img.shields.io/npm/dm/react-native-version.svg)](https://www.npmjs.com/package/react-native-version)

Seamlessly shadows the behaviour of [`npm version`](https://docs.npmjs.com/cli/version).

## npm-scripts hook (automatic method)

### Setup

```bash
$ npm install react-native-version --save-dev
# or
$ yarn add react-native-version --dev
```

Hook into the "version" or "postversion" npm script in your app's package.json:

```diff
{
	"name": "AwesomeProject",
	"version": "0.0.1",
	"private": true,
	"scripts": {
		"start": "node node_modules/react-native/local-cli/cli.js start",
+		"postversion": "react-native-version"
	},
	// ...
}
```

### Usage

Before you publish a new build of your app, run `npm version <newversion>`.

react-native-version will then update your `android/` and `ios/` code. Depending on the script and options you choose, it can also automatically amend the version bump commit and update the Git tag created by `npm version`. This method should be useful in most cases. If you need more control, take a look at the CLI and options below.

## CLI

### Setup

```bash
$ npm install -g react-native-version
# or
$ yarn global add react-native-version
```

### Example usage

```bash
$ cd AwesomeProject/
$ npm version patch
$ react-native-version
```

## Options

<!-- START cli -->
	-h, --help                output usage information
	-V, --version             output the version number
	-a, --amend               Amend the previous commit. Also updates the latest Git tag to point to the amended commit. This is done automatically when react-native-version is run from the "version" or "postversion" npm script. Use "--never-amend" if you never want to amend.
	--skip-tag                For use with "--amend", if you don't want to update Git tags. Use this option if you have git-tag-version set to false in your npm config or you use "--no-git-tag-version" during npm-version.
	-A, --never-amend         Never amend the previous commit.
	-b, --increment-build     Only increment build number.
	-d, --android [path]      Path to your "android/app/build.gradle" file.
	-i, --ios [path]          Path to your "ios/" folder.
	-L, --legacy              Version iOS using agvtool (macOS only). Requires Xcode Command Line Tools.
	-q, --quiet               Be quiet, only report errors.
	-r, --reset-build         Reset build number back to "1" (iOS only). Unlike Android's "versionCode", iOS doesn't require you to bump the "CFBundleVersion", as long as "CFBundleShortVersionString" changes. To make it consistent across platforms, react-native-version bumps both by default. You can use this option if you prefer to keep the build number value at "1" after every version change. If you then need to push another build under the same version, you can use "-bt ios" to increment.
	-t, --target <platforms>  Only version specified platforms, eg. "--target android,ios".

<!-- END cli -->

You can apply these options to the "version" or "postversion" script too. If for example you want to commit the changes made by RNV yourself, add the "--never-amend" option:

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

```bash
$ RNV=android,ios npm version patch
# or
$ RNV=android,ios react-native-version
```

When using the CLI, you can even combine both methods and make your teammates rage :smiling_imp: :suspect::

```bash
$ RNV=android react-native-version --target ios
```
:rage1: :speak_no_evil:

## API

```javascript
import { version } from 'react-native-version';

async function doSomething() {
	const versionResult = await version({
		amend: true,
		// ...
	});
}

// or

version({
	amend: true,
	// ...
})
.then(commitHash => {
	console.log(commitHash);
})
.catch(err => {
	console.error(err);
});
```

<!-- START api -->
### Functions

<dl>
<dt><a href="#version">version(program, projectPath)</a> ⇒ <code>Promise.&lt;(string|Error)&gt;</code></dt>
<dd><p>Versions your app</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#Promise">Promise</a></dt>
<dd><p>Custom type definition for Promises</p>
</dd>
</dl>

<a name="version"></a>

### version(program, projectPath) ⇒ <code>Promise.&lt;(string\|Error)&gt;</code>
Versions your app

**Kind**: global function  
**Returns**: <code>Promise.&lt;(string\|Error)&gt;</code> - A promise which resolves with the last commit hash  

| Param | Type | Description |
| --- | --- | --- |
| program | <code>Object</code> | commander/CLI-style options, camelCased |
| projectPath | <code>string</code> | Path to your React Native project |

<a name="Promise"></a>

### Promise
Custom type definition for Promises

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| result | <code>\*</code> | See the implementing function for the resolve type and description |
| result | <code>Error</code> | Rejection error object |

<!-- END api -->

## See also

- [agvtool](https://developer.apple.com/library/content/qa/qa1827/_index.html)
- [npm-version](https://docs.npmjs.com/cli/version)
- [Semantic Versioning (semver)](http://semver.org/)
- [ionic-version](https://github.com/stovmascript/ionic-version)
