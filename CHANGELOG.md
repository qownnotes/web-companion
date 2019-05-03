# QOwnNotes Web Companion Changelog

## 19.5.0
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
    - clicking a line opens the url in a new browser tab
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
    - the html will be converted to markdown and images of the page will be downloaded (might take a while)
- added support to add a screenshot of the visible area as new note in QOwnNotes 18.12.9 and higher
- selected text will now be created as new note with newlines if possible

## 18.12.1
- fixed the default port
- the url of the page will now also be written to the note
- restructured the context menu
- added an context menu entry to reset the settings

## 18.12.0
- added support to add selected text as new note in QOwnNotes 18.12.7 and higher
  (for QOwnNotes issue [#330](https://github.com/pbek/QOwnNotes/issues/330))
- you can change the socket port to talk to in the context menu
