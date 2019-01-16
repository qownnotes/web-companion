# [QOwnNotes](https://www.qownnotes.org "QOwnNotes Official Site") Web Companion browser extension

[Changelog](https://github.com/qownnotes/web-companion/blob/develop/CHANGELOG.md) |
[Releases](https://github.com/qownnotes/web-companion/releases) |
[Chrome Web Store](https://chrome.google.com/webstore/detail/qownnotes-web-companion/pkgkfnampapjbopomdpnkckbjdnpkbkp) |
[Firefox Add-ons page](https://addons.mozilla.org/firefox/addon/qownnotes-web-companion) |
[QOwnNotes Webpage](https://www.qownnotes.org)

This is a companion browser extension for [QOwnNotes](https://www.qownnotes.org) to interact with the note taking desktop application.

[QOwnNotes](https://www.qownnotes.org) is the **open source** (GPL) plain-text file **markdown note taking**
application for GNU/Linux, macOS and Windows, that (optionally) works together with the notes application of
[**ownCloud**](https://github.com/owncloud/notes) or [**Nextcloud**](https://github.com/Nextcloud/notes).

The extension is currently tested for Google Chrome and Mozilla Firefox.

## Features

- creating a new note (only text) from the **current selection** by right-clicking it
- creating a new note from the content of the **current webpage** by right-clicking on the page
    - the html will be converted to markdown and images of the page will be downloaded (might take a while)
- creating a new note with a **screenshot** of the visible part of the current webpage by right-clicking on the page
- **managing bookmarks** with QOwnNotes notes
    - for more information about the **bookmarks feature** please visit
      [QOwnNotes Web Companion browser extension](https://www.qownnotes.org/Knowledge-base/QOwnNotes-Web-Companion-browser-extension)
- you can change the server socket port in the extension *Option page*

## Installation

Download the latest release from [Releases](https://github.com/qownnotes/web-companion/releases), visit
`chrome://extensions/` (for Chrome) and drop the extension file into your browser.

You can also use the [Chrome Web Store](https://chrome.google.com/webstore/detail/qownnotes-web-companion/pkgkfnampapjbopomdpnkckbjdnpkbkp)
or the [Firefox Add-ons page](https://addons.mozilla.org/firefox/addon/qownnotes-web-companion) to install the extension.

To use this extension [QOwnNotes](https://www.qownnotes.org) needs to be running.

## Development

```bash
npm install

npm run dev chrome
npm run dev firefox
```

## Building packages

```bash
./build.sh
```
