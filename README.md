# react-native-version

[![license](https://badgen.net/github/license/stovmascript/react-native-version)](https://github.com/stovmascript/react-native-version/blob/master/LICENSE)
[![npm](https://badgen.net/npm/v/react-native-version)](https://www.npmjs.com/package/react-native-version)
[![travis](https://badgen.net/travis/stovmascript/react-native-version)](https://travis-ci.org/stovmascript/react-native-version)
[![david](https://badgen.net/david/dep/stovmascript/react-native-version)](https://github.com/stovmascript/react-native-version/network/dependencies)

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
  "scripts": {
    "start": "node node_modules/react-native/local-cli/cli.js start",
+   "postversion": "react-native-version"
  }
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

    -V, --version                output the version number
    -a, --amend                  Amend the previous commit. This is done automatically when react-native-version is run from the "version" or "postversion" npm script. Use "--never-amend" if you never want to amend. Also, if the previous commit is a valid npm-version commit, react-native-version will update the Git tag pointing to this commit.
    --skip-tag                   For use with "--amend", if you don't want to update Git tags. Use this option if you have git-tag-version set to false in your npm config or you use "--no-git-tag-version" during npm-version.
    -A, --never-amend            Never amend the previous commit.
    -b, --increment-build        Only increment build number.
    -B, --never-increment-build  Never increment build number.
    -d, --android [path]         Path to your "android/app/build.gradle" file. (default: "android/app/build.gradle")
    -i, --ios [path]             Path to your "ios/" folder. (default: "ios")
    -L, --legacy                 Version iOS using agvtool (macOS only). Requires Xcode Command Line Tools.
    -q, --quiet                  Be quiet, only report errors.
    -r, --reset-build            Reset build number back to "1" (iOS only). Unlike Android's "versionCode", iOS doesn't require you to bump the "CFBundleVersion", as long as "CFBundleShortVersionString" changes. To make it consistent across platforms, react-native-version bumps both by default. You can use this option if you prefer to keep the build number value at "1" after every version change. If you then need to push another build under the same version, you can use "-bt ios" to increment.
    -s, --set-build <number>     Set a build number. WARNING: Watch out when setting high values. This option follows Android's app versioning specifics - the value has to be an integer and cannot be greater than 2100000000. You cannot decrement this value after publishing to Google Play! More info at: https://developer.android.com/studio/publish/versioning.html#appversioning
    --generate-build             Generate build number from the package version number. (e.g. build number for version 1.22.3 will be 1022003)
    -t, --target <platforms>     Only version specified platforms, e.g. "--target android,ios".
    -h, --help                   output usage information

<!-- END cli -->

You can apply these options to the "version" or "postversion" script too. If for example you want to commit the changes made by RNV yourself, add the "--never-amend" option:

```diff
{
  "scripts": {
-   "postversion": "react-native-version"
+   "postversion": "react-native-version --never-amend"
  }
}
```

## Targeting platforms

The default behaviour is to version all React Native platforms. You can target specific platforms by passing a comma-separated list to the "--target" option, or by using the `RNV` environment variable:

```bash
$ RNV=android,ios npm version patch
# or
$ RNV=android,ios react-native-version
```

When using the CLI, you can even combine both methods and make your teammates rage :smiling_imp: :suspect:

```bash
$ RNV=android react-native-version --target ios
```

:rage1: :speak_no_evil:

## Custom version commit message

When updating Git tags, RNV uses the version commit message to find the correct Git tag. If you're running `npm version` with the `-m` or `--message` option, make sure your message includes `%s`, which will be replaced with the resulting version number. For example:

```bash
$ npm version patch -m "Upgrade to %s for reasons"
```

If you're using yarn, you can configure the commit message generated by `yarn version` though `yarn config set version-git-message` - see the [docs](https://yarnpkg.com/lang/en/docs/cli/version/#toc-git-tags).

The behavior can be also adjusted by `.npmrc` and `.yarnrc` config files.

## API

```javascript
import { version } from "react-native-version";

async function doSomething() {
  const versionResult = await version({
    amend: true
    // ...
  });
}

// or

version({
  amend: true
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

| Param       | Type                | Description                             |
| ----------- | ------------------- | --------------------------------------- |
| program     | <code>Object</code> | commander/CLI-style options, camelCased |
| projectPath | <code>string</code> | Path to your React Native project       |

<a name="Promise"></a>

### Promise

Custom type definition for Promises

**Kind**: global typedef  
**Properties**

| Name   | Type               | Description                                                        |
| ------ | ------------------ | ------------------------------------------------------------------ |
| result | <code>\*</code>    | See the implementing function for the resolve type and description |
| result | <code>Error</code> | Rejection error object                                             |

<!-- END api -->

## Known issues

### `SyntaxError: Expected """, "\'", "\"", "\n", or [^\"] but "\" found.`

When running `react-native link` on Windows, native modules will be linked in your Xcode project with paths that include backslashes (`\`) instead of forward slashes (`/`). This will break `pbxproj-dom`, which we rely on to parse Xcode projects. To fix this issue, convert any `LIBRARY_SEARCH_PATHS` and `HEADER_SEARCH_PATHS` as shown in [this comment](https://github.com/stovmascript/react-native-version/issues/52#issuecomment-393343784). This step could be automated with a library like [normalize-path](https://www.npmjs.com/package/normalize-path) or [unixify](https://www.npmjs.com/package/unixify).

## See also

- [agvtool](https://developer.apple.com/library/content/qa/qa1827/_index.html)
- [npm-version](https://docs.npmjs.com/cli/version)
- [Semantic Versioning (semver)](http://semver.org/)
- [ionic-version](https://github.com/stovmascript/ionic-version)
