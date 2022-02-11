let ws = null;
let connected = false;
const serverUrl = "ws://127.0.0.1";
let sendText = "";
let socketPort = 22222;
let token = "";
import * as util from '../scripts/util';
var isFirefox = typeof InstallTrigger !== 'undefined';

// A generic onclick callback function.
function genericOnClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
}

/**
 * Scrape selection callback
 *
 * @param info
 * @param tab
 */
function scrapeSelection(info, tab) {
    checkConsent(info, tab, (info, tab) => {
        // console.log("info: " + JSON.stringify(info));
        // console.log("tab: " + JSON.stringify(tab));
        //
        // console.log(info.pageUrl);
        // console.log(info.selectionText);

        // let selection = window.getSelection();
        // console.log(selection);
        //
        // console.log(getSelected());
        //
        // testSelection();
        //
        // var html = "";
        // if (typeof window.getSelection != "undefined") {
        //     var sel = window.getSelection();
        //     if (sel.rangeCount) {
        //         var container = document.createElement("div");
        //         for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        //             container.appendChild(sel.getRangeAt(i).cloneContents());
        //         }
        //         html = container.innerHTML;
        //     }
        // } else if (typeof document.selection != "undefined") {
        //     if (document.selection.type == "Text") {
        //         html = document.selection.createRange().htmlText;
        //     }
        // }
        //
        // console.log(html);

        // chrome.tabs.executeScript( tab.tabId, {
        //     code: "window.getSelection();"
        // }, function(selection) {
        //     console.log("window.getSelection();");
        //     console.log(selection);
        // });

        // chrome.extension.sendRequest(window.getSelection().toString(), function(response) {
        //     console.log(response);
        // });

        // chrome.tabs.getSelected( null , function(tab) {
        //     console.log(tab);
        // });

        // chrome.tabs.executeScript( tab.tabId, {
        //     code: "window.getSelection();"
        // }, function(selection) {
        //     console.log("window.getSelection() 2;");
        //     console.log(selection.toString());
        //     console.log(selection[0].rangeCount);
        //     var html;
        //
        //     if (selection.rangeCount) {
        //         var container = document.createElement("div");
        //         for (var i = 0, len = selection.rangeCount; i < len; ++i) {
        //             container.appendChild(selection.getRangeAt(i).cloneContents());
        //         }
        //         html = container.innerHTML;
        //     }
        //
        //     console.log(html);
        // });
        //
        //
        //
        // chrome.tabs.sendRequest(tab.id, {method: "getSelection"}, function(response){
        //     console.log(response);
        //     return;
        //     var url=response.url;
        //     var subject=response.subject;
        //     var body= response.body;
        //
        //     if(body===''){
        //         body="No text selected";
        //         //You may choose to pop up a text box allowing the user to enter in a message instead.
        //     }
        //     //From here, you can POST the variables to any web service you choose.
        //
        //     console.log(body);
        // });

        // this will get us the selected text with newlines
        chrome.tabs.executeScript( {
            code: "window.getSelection().toString();"
        }, function(selection) {
            // if you try and inject into an extensions page or the webstore/NTP you'll get an error
            // we then have to fallback to info.selectionText, which will get us the selected text without newlines (Chrome bug)
            const selectionText = chrome.runtime.lastError ? info.selectionText : selection[0];
            const headline = tab.title;
            const text = "<" + tab.url + ">\n\n" + selectionText;

            // also take a screenshot to be able to use it in the QOwnNotes scripting hook
            chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl) {
                const data = {
                    type: "handleRawData", requestType: "selection", contentType: "markdown", rawData: selectionText,
                    headline: headline, text: text, pageUrl: info.pageUrl, pageTitle: headline, screenshotDataUrl: dataUrl
                };

                WebSocketClient.sendData(data);
            });
        });
    })
}

/**
 * Scrape page screenshot callback
 *
 * @param info
 * @param tab
 */
function scrapePageScreenshot(info, tab) {
    checkConsent(info, tab, (info, tab) => {
        chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl) {
            const headline = tab.title;

            // const text = "<" + tab.url + ">\n\n![](" + dataUrl + ")";
            // const data = {type: "newNote", contentType: "markdown", headline: headline, text: text, pageUrl: info.pageUrl};

            const url = tab.url;
            const text = "<a href=\"" + url + "\">" + url + "</a><br /><br /><img src=\"" + dataUrl + "\" />";
            const data = {type: "newNote", contentType: "html", headline: headline, text: text, pageUrl: url};
            WebSocketClient.sendData(data);
        });
    })
}

/**
 * Scrape html page callback
 *
 * @param info
 * @param tab
 */
function scrapeHTMLPage(info, tab) {
    checkConsent(info, tab, (info, tab) => {
        chrome.tabs.executeScript(null, {
            file: "scripts/functions.js"
        }, function() {
            // If you try and inject into an extensions page or the webstore/NTP you'll get an error
            if (chrome.runtime.lastError) {
                // This only works in Chrome
                alert('Error: \n' + chrome.runtime.lastError.message);
            }
        });
    })
}

function getServerUrl() {
    return serverUrl + ":" + socketPort;
}

/**
 * Check if the consent was given and then run the real function
 *
 * @param info
 * @param tab
 * @param fun
 */
function checkConsent(info, tab, fun) {
    chrome.storage.sync.get(function (data) {
        if (data.userDataConsent === true) {
            fun(info, tab);
        } else {
            // This only works in Chrome
            alert('You need to open the QOwnNotes Web Companion extension popup to allow data being sent to QOwnNotes!');
        }
    });
}

// function getSelected() {
//     var text = "";
//     if (window.getSelection
//         && window.getSelection().toString()
//         && $(window.getSelection()).attr('type') != "Caret") {
//         text = window.getSelection();
//         return text;
//     }
//     else if (document.getSelection
//         && document.getSelection().toString()
//         && $(document.getSelection()).attr('type') != "Caret") {
//         text = document.getSelection();
//         return text;
//     }
//     else {
//         var selection = document.selection && document.selection.createRange();
//
//         if (!(typeof selection === "undefined")
//             && selection.text
//             && selection.text.toString()) {
//             text = selection.text;
//             return text;
//         }
//     }
//
//     return false;
// }
//
// function getSelectedHTML() {
//     var range = window.getSelection().getRangeAt(0); // Get the selected range
//     var div = document.createElement("div");
//     div.appendChild(range.cloneContents()); // Get the document fragment from selected range
//     return div.innerHTML; // Return the actual HTML
// }
//
// function testSelection() {
//     if (window.getSelection) { // all browsers, except IE before version 7
//         var selectionRange = window.getSelection ();
//         alert ("The text content of the selection:\n" + selectionRange.toString ());
//     }
//     else {
//         if (document.selection.type == 'None') {
//             alert ("No content is selected, or the selected content is not available!");
//         }
//         else {
//             var textRange = document.selection.createRange ();
//             alert ("The text content of the selection:\n" + textRange.text);
//         }
//     }
// }

/**
 * Load the settings
 */
function loadSettings() {
    chrome.storage.sync.get( function ( data ) {
        token = data.token;
        const port = data.socketPort;

        if (port !== null && !isNaN(port)) {
            socketPort = parseInt(data.socketPort);
            console.log("socketPort from settings");
            console.log(socketPort);
        }
    } );
}

loadSettings();

// load settings they were changed on the options page
chrome.storage.onChanged.addListener(function () {
    loadSettings();
});

const mainMenu = chrome.contextMenus.create({
    "title": "QOwnNotes", "contexts": ["page"]
});

chrome.contextMenus.create({
    "title": util.getLocale('sendPageToQOwnNotes'), "contexts": ["page"],
    "onclick": scrapeHTMLPage, "parentId": mainMenu
});

chrome.contextMenus.create({
    "title": util.getLocale('createScreenshotNote'), "contexts": ["page"],
    "onclick": scrapePageScreenshot, "parentId": mainMenu
});

chrome.contextMenus.create({
    "title": util.getLocale('sendSelectionToQOwnNotes'), "contexts": ["selection"],
    "onclick": scrapeSelection, "parentId": null
});

chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log("request:");
    console.log(request);
    // used by scrapeHTMLPage
    if (request.action === "getSource") {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            const tab = tabs[0];
            const headline = tab.title;
            const url = tab.url;
            // default text for creating a note
            const text = "<a href=\"" + url + "\">" + url + "</a><br /><br />" + request.source;

            // also take a screenshot to be able to use it in the QOwnNotes scripting hook
            chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl) {
                const data = {
                    type: "handleRawData", requestType: "page", contentType: "html", rawData: request.source,
                    headline: headline, text: text, pageTitle: headline, pageUrl: url, screenshotDataUrl: dataUrl
                };
                WebSocketClient.sendData(data);
            });
        });
    }

    // if (request.method === "getSelection"){
    //     var selection = window.getSelectionHTML();
    //     console.log(selection);
    //     sendResponse({body: selection, url: window.location.href, subject: document.title});
    // }
});

let open = function () {
    ws = new WebSocket(getServerUrl());
    ws.onopen = onOpen;
    ws.onclose = onClose;
    ws.onmessage = onMessage;
    ws.onerror = onError;
};

let close = function () {
    if (ws) {
        console.log('CLOSING ...');
        ws.close();
    }
    connected = false;
};

let onOpen = function () {
    console.log('OPENED: ' + getServerUrl());
    connected = true;
    sendMessageToSocket();
};

let sendMessageToSocket = function () {
    if (sendText === "") {
        return;
    }

    ws.send(sendText);
    sendText = "";

    // this might crash QOwnNotes
    // close();
};

let onClose = function () {
    console.log('CLOSED: ' + getServerUrl());
    ws = null;
    connected = false;
};

let onMessage = function (event) {
    addMessage(event.data, event.type);
};

let onError = function (event) {
    alert(util.getLocale('connectionFailed') + "\n" + event.data);
};

let addMessage = function (data, type) {
    console.log(type);
    console.log(data);
};

let WebSocketClient = {
    sendData: function (data) {
        data.token = token;
        sendText = JSON.stringify(data);

        if (!connected) {
            // open will send the message
            open();
        } else {
            sendMessageToSocket();
        }
    }
};

/*

/!**
 * Gets the HTML of the user's selection
 *!/
function getSelectionHTML() {
    var userSelection;
    if (window.getSelection) {
        // W3C Ranges
        userSelection = window.getSelection ();
        // Get the range:
        if (userSelection.getRangeAt)
            var range = userSelection.getRangeAt (0);
        else {
            var range = document.createRange ();
            range.setStart (userSelection.anchorNode, userSelection.anchorOffset);
            range.setEnd (userSelection.focusNode, userSelection.focusOffset);
        }
        // And the HTML:
        var clonedSelection = range.cloneContents ();
        var div = document.createElement ('div');
        div.appendChild (clonedSelection);
        return div.innerHTML;
    } else if (document.selection) {
        // Explorer selection, return the HTML
        userSelection = document.selection.createRange ();
        return userSelection.htmlText;
    } else {
        return '';
    }
}
*/
