#!/usr/bin/env bash

if [[ "$CI" != "true" || "$TRAVIS_OS_NAME" == "osx" ]]; then
	ava $@
else
	ava --match="!*legacy*" $@
fi
