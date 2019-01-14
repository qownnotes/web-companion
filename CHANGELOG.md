# QOwnNotes Web Companion Changelog

## 19.1.3
- preventing opening of two new tabs when clicking a bookmark

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
