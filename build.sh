#!/usr/bin/env bash
###
# Builds the extensions for Chrome and Firefox
###

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR" || exit 1

# workaround for wrong 20xx version number for the Chrome extension
sed -i -e 's/"version": "/"version": "20/g' package.json || exit 1
npm run build chrome || exit 1

# switch back to the correct version number format again
sed -i -e 's/"version": "20/"version": "/g' package.json || exit 1
npm run build firefox || exit 1
#npm run build-no-minimize firefox || exit 1

# download sourcecode for Mozilla store
curl https://github.com/qownnotes/web-companion/archive/refs/heads/develop.zip -Lo ./dist/develop.zip
