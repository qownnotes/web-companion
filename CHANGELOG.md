# QOwnNotes Web Companion Changelog

## 18.12.2
- added support to import pages as new note in QOwnNotes 18.12.9 and higher
    - the html will be converted to markdown and images of the page will be downloaded (might take a while)
- added support to add a screenshot of the visible area as new note
    - the screenshot will be added as `data:image` image as markdown
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
