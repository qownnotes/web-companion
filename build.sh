#!/usr/bin/env bash
###
# Builds the extensions for Chrome and Firefox
###

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR" || exit 1

# Build the Chrome extension
npm run build-chrome || exit 1
mv dist/bex/Packaged.qownnotes-web-companion.zip dist/package-chrome.zip || exit 1

# Build the Firefox extension
npm run build-firefox || exit 1
mv dist/bex/Packaged.qownnotes-web-companion.zip dist/package-firefox.zip || exit 1

# Download sourcecode for Mozilla store
curl https://github.com/qownnotes/web-companion/archive/refs/heads/main.zip -Lo dist/sourcecode.zip
