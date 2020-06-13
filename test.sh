#!/usr/bin/env bash

if [[ "$CI" != "true" || "$RUNNER_OS" == "macOS" ]]; then
	ava $@
else
	ava --match="!*legacy*" $@
fi
