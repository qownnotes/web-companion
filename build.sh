#!/usr/bin/env bash
###
# Builds the extensions for Chrome and Firefox
###

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR" || exit 1

# workaround for wrong 20xx version number for the Chrome extension
sed -i -e 's/"version": "/"version": "20/g' package.json || exit 1
npm run build chrome || exit 1
# remove background.scripts from manifest.json for manifest v3 for Chrome
jq 'del(.background.scripts)' dist/chrome/manifest.json > /tmp/manifest.json && mv /tmp/manifest.json dist/chrome/manifest.json
# create new package
pushd dist/chrome && zip -r ../../packages/chrome.zip . && popd

# switch back to the correct version number format again
sed -i -e 's/"version": "20/"version": "/g' package.json || exit 1
npm run build firefox || exit 1
#npm run build-no-minimize firefox || exit 1

# download sourcecode for Mozilla store
curl https://github.com/qownnotes/web-companion/archive/refs/heads/develop.zip -Lo ./packages/sourcecode.zip
