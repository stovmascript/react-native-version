#!/usr/bin/env bash

./cli.js -h \
| sed -e '1,/Options:/d' \
| sed -e :a -e '/./,$!d;/^\n*$/{$d;N;};/\n$/ba' \
| sed -e 's/^[[:space:]]*/	/' \
| node-injectmd -t cli -i README.md

jsdoc2md -d 3 index.js \
| sed -e :a -e '/./,$!d;/^\n*$/{$d;N;};/\n$/ba' \
| node-injectmd -t api -i README.md
