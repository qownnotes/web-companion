# QOwnNotes Web Companion Changelog

## 2024.4.0
- the "running away" of the Preferences dialog was fixed under Firefox when
  using a zoom-level over 100% (for [#63](https://github.com/qownnotes/web-companion/issues/63))

## 2024.2.4
- now only a delete button is shown in the bookmarks list if the bookmark
  can be deleted (for [#57](https://github.com/qownnotes/web-companion/issues/57))
- fixed a problem where links without name couldn't be opened when the link directly was clicked
- there now is a new private mode switch, that allows opening bookmarks in
  a private window (for [#58](https://github.com/qownnotes/web-companion/issues/58))

## 2024.2.3
- the missing delete code was added (for [#57](https://github.com/qownnotes/web-companion/issues/57))
- the minimum height of the popup was raised to 300px to allow
  dialogs to be shown fully if there is little content

## 2024.2.2
- bookmarks can now be deleted in the bookmarks list (for [#57](https://github.com/qownnotes/web-companion/issues/57))
- added more Arabic translation (thank you noureddin)

## 2024.2.1
- an issue with the columns in the bookmarks list was fixed
  (for [#56](https://github.com/qownnotes/web-companion/issues/56))
- the minimum version for Firefox was raised to 109, because of manifest version 3
  (for [#56](https://github.com/qownnotes/web-companion/issues/56))
- `host_permissions` were removed from the manifest file for Chrome, because they are not needed
  (for [#56](https://github.com/qownnotes/web-companion/issues/56))
- added more translation

## 2024.2.0
- the extension was completely **rewritten in Vue.js 3 with Vite using QUASAR with BEX**
  (for [#56](https://github.com/qownnotes/web-companion/issues/56))
  - also both the Chrome and Firefox extensions are now using manifest version 3

## 22.12.1
- the package for Chrome was fixed (for [#41](https://github.com/qownnotes/web-companion/issues/41))

## 22.12.0
- changed Firefox default shortcut to <kbd>Ctrl + Alt + B</kbd> since the browser blocked <kbd>Ctrl + Shift + B</kbd>
  (for [#48](https://github.com/qownnotes/web-companion/issues/48))
- added a lot more translation
- updated dependencies

## 22.2.4
- for Chrome the extension was ported to the soon mandatory manifest v3 (for [#38](https://github.com/qownnotes/web-companion/issues/38))

## 22.2.3
- a user data consent page was added for the Firefox Store (for [#37](https://github.com/qownnotes/web-companion/issues/37))
  - you need to open the extension popup and give your consent that personal data
    can be sent to QOwnNotes once
- added more translation

## 21.10.0
- when adding a bookmark and pressing enter to store it, now the 2nd `Add bookmark` dialog, that was triggered, is suppressed
- updated dependencies
- added a lot more translation

## 21.9.0
- added a link to the [Web clipper documentation](https://www.qownnotes.org/getting-started/browser-extension.html#web-clipper)
  to the hamburger menu on the top left to give more exposure to that feature
- updated dependencies
- added more Sinhala translation

## 21.8.1
- updated dependencies

## 21.8.0
- migrated to webextension-toolbox 4 and webpack 5 to fix a lot of vulnerabilities
- added more Croatian translation

## 21.6.0
- fixed a problem with cut-off security tokens when they start with a number
  (for [#33](https://github.com/qownnotes/web-companion/issues/33))
- added a lot more translation

## 20.10.0
- added more translation

## 20.9.7
- fixed unnecessary scrollbar in Firefox
- you can now scroll in your bookmark list while the top toolbar is still visible

## 20.9.6
- the `content_security_policy` with `unsafe-eval` was removed for the Firefox store
- the success message snackbar is now shown on the top of the bookmarks popup
  to prevent it from being outside the visible area
- the empty space of the popup in Firefox was fixed
- when bookmarks are added now the bookmark list will be reloaded

## 20.9.5
- the whole application was ported to Vuetify 2 for it to be more future-proof
- more text was made translatable and the default ui components are now localized
- the options page was improved and more hints were added
- you can now jump to the first and last bookmarks page

## 20.9.4
- fixed opening of all bookmarks in new tabs
- added more translation

## 20.9.3
- fixed focusing and selecting in the search input field
- removed jQuery dependency

## 20.9.2
- added more translation

## 20.9.1
- icons now were switched to [Font Awesome Icons 4](https://fontawesome.com/v4.7.0/icons/)
  because all other icon sets take far too much space to be accepted into the Firefox store
  (for [#25](https://github.com/qownnotes/web-companion/issues/25))

## 20.9.0
- now the [Material Design Icons](https://materialdesignicons.com/) are used as icons
  instead of Google's Material Icons (that were using icon fonts) to allow disabling
  of icon fonts in Firefox (for [#25](https://github.com/qownnotes/web-companion/issues/25))
- all text fields are now clearable with a small `x` icon

## 20.8.2
- fixed adding of bookmarks due to Vue/Vuetify update
- Chrome store releasing is now done via GitHub Actions

## 20.8.1
- changed Firefox default shortcut to <kbd>Ctrl + Shift + B</kbd>
- added more translation

## 20.8.0
- building is now done with GitHub Actions
- library security updates were made

## 20.5.0
- screenshots are now captured as PNG instead of the browser's default format to capture screenshots
  (for [#17](https://github.com/qownnotes/web-companion/issues/17))
- the context menu entries `Create note from page (HTML import)` and `Create note from selection`
  where renamed to `Send page to QOwnNotes` and `Send selection to QOwnNotes`, because now a screenshot
  of the current page will also be sent to QOwnNotes so you are able to use them in scripts
  (for [#16](https://github.com/qownnotes/web-companion/issues/16) and [#17](https://github.com/qownnotes/web-companion/issues/17))
    - you need QOwnNotes 20.5.7 or higher for this feature
    - the default behavior is still that a new note is created with the page or selection text
- library security updates were made
- added more translation

## 19.7.0
- you can now substring search for all parts of your search text, for example `qo sto` will find `Firefox Store Page QOwnNotes`
- added more German, Indonesian and Czech translation

## 19.5.5
- the **security token** will now be sent correctly to QOwnNotes for context menu operations
  (for [#10](https://github.com/qownnotes/web-companion/issues/10))

## 19.5.4
- you are now also able to enter the **security token** in the browser extension options
- added more translation

## 19.5.3
- you are now able to enter a **security token** to communicate with QOwnNotes
    - QOwnNotes 19.5.4 or higher needs this feature to ensure no other web page or application can access your bookmarks
- added a lot of translation

## 19.5.2
- you now can **import all browser bookmarks** (for [#8](https://github.com/qownnotes/web-companion/issues/8))

## 19.5.1
- fixed a bookmark filtering problem

## 19.5.0
- you can now also **search** for the **description of bookmarks**
- a **loading progressbar** will now be shown while bookmarks are loaded when the **note folder is switched** by the user
    - you need QOwnNotes 19.5.1 or higher for this feature
- added a lot of translation

## 19.4.0
- you can now **change** the **current note folder** in a select box in the toolbar of the **bookmarks popup**
    - you need QOwnNotes 19.4.1 or higher for this feature

## 19.1.11
- added support to show a success message from QOwnNotes if bookmarks were created
    - you need QOwnNotes 19.1.9 or higher for this feature
- fixed restoring of previously selected tags
- added more translation

## 19.1.10
- added a lot of translation

## 19.1.9
- fixed `tabs` permissions

## 19.1.8
- you can now **filter bookmarks by tags**
    - use access key <kbd>T</kbd> to jump to the tag selector
    - the selected tags will be persisted and restored the next time the bookmarks popup is opened
- you can now **bookmark all tabs** with a button in the **bookmark popup**
    - use access key <kbd>B</kbd> to press the button
    - you need QOwnNotes 19.1.8 or higher for this feature
- changed the **default shortcut** for the **bookmarks popup** in **Firefox** to <kbd>Alt + Shift + B</kbd>,
  because <kbd>Ctrl + B</kbd> is blocked
    - these shortcuts will only work in Firefox 66 and newer

## 19.1.7
- added **access keys** to some **bookmark popup** actions
    - access key <kbd>A</kbd> to add a new bookmarks (for example press <kbd>Alt + A</kbd> in Chrome)
    - access key <kbd>S</kbd> to search for bookmarks
    - access key <kbd>O</kbd> to open all visible bookmarks

## 19.1.6
- you can now **add new bookmarks** with a button in the **bookmark popup**
    - you need QOwnNotes 19.1.6 or higher for this feature
- you can now **open all visible bookmarks** in new tabs with a button in the **bookmark popup**

## 19.1.5
- the previously entered **search text** in the **bookmark popup** is now **automatically selected and focused**,
  so that you can overwrite it and start to search immediately
- the tab-order was now adapted, so that you can **navigate the links** with <kbd>Tab</kbd> easily
- there now is a **default shortcut** <kbd>Ctrl + B</kbd> for **opening the bookmarks popup**
- the name of the **current note folder** will now be displayed in the top toolbar of the **bookmark popup**
    - you need QOwnNotes 19.1.5 or higher for this feature

## 19.1.4
- bookmarks styling changes and the **search field** can now be **reset**
- the content of the bookmarks **search field** will now be **persisted**
- links in the **current note** will now have the tag `current`
- special **bookmark links** of **all notes tagged** with `bookmarks` will be shown
    - you can change that tag name in the *QOwnNotes settings*
- for more information about the **bookmarks feature** please visit
  [QOwnNotes Web Companion browser extension](https://www.qownnotes.org/Knowledge-base/QOwnNotes-Web-Companion-browser-extension)

## 19.1.3
- preventing opening of two new tabs when clicking a bookmark
- added support for the new **tag** and **description** attributes in **bookmarks**
    - the syntax for using this bookmark links in notes is `- [name](http://link) #tag1 #tag2 some description`
    - tags will be shown in the list and the description will be shown in a new tooltip

## 19.1.2
- you can now browse a **list of all links in the current note** if you click on the QOwnNotes icon in the browser toolbar
    - you can **search for links** on the popup
    - clicking a line opens the URL in a new browser tab
    - clicking on the headline items of the table sorts the items in the table
    - you need QOwnNotes 19.1.2 or higher for this feature
- added more German translation (thank you rakekniven)

## 19.1.1
- reimplementation of extension with webextension-toolbox, webpack and VueJS for Google Chrome and Mozilla Firefox
    - creating notes from the current selection, the whole page and as screenshot now works with Firefox and Chrome again
- there now is a browser option page to set and reset the server socket port
- the text of the extension can now be translated
    - visit [QOwnNotes translations](https://crowdin.com/project/qownnotes) if you want to help to translate the
      interface to your language

## 19.1.0
- added popup menu for setting the port and resetting the settings (for [#1](https://github.com/qownnotes/web-companion/issues/1), thank you @Offerel)
- added support for Firefox (for [#1](https://github.com/qownnotes/web-companion/issues/1), thank you @Offerel)

## 18.12.2
- added support to import pages as new note in QOwnNotes 18.12.9 and higher
    - the HTML will be converted to Markdown and images of the page will be downloaded (might take a while)
- added support to add a screenshot of the visible area as new note in QOwnNotes 18.12.9 and higher
- selected text will now be created as new note with newlines if possible

## 18.12.1
- fixed the default port
- the URL of the page will now also be written to the note
- restructured the context menu
- added a context menu entry to reset the settings

## 18.12.0
- added support to add selected text as new note in QOwnNotes 18.12.7 and higher
  (for QOwnNotes issue [#330](https://github.com/pbek/QOwnNotes/issues/330))
- you can change the socket port to talk to in the context menu
