#!/usr/bin/env bash
###
# Builds the extensions for Chrome and Firefox
###

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# workaround for wrong 20xx version number for the Chrome extension
sed -i -e 's/"version": "/"version": "20/g' package.json
npm run build chrome

# switch back to the correct version number format again
sed -i -e 's/"version": "20/"version": "/g' package.json
npm run build firefox
