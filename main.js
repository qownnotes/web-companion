let ws = null;
let connected = false;
const serverUrl = "ws://127.0.0.1";
let sendText = "";
let socketPort = 22222;

// A generic onclick callback function.
function genericOnClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
}

/**
 *
 * @param info
 * @param tab
 */
function setSocketPort(info, tab) {
    const portText = prompt("Please enter the QOwnNotes socket port", socketPort);

    if (portText === null) {
        return;
    }

    const port = parseInt(portText);

    if (port === 0) {
        return;
    }

    console.log(port);
    socketPort = port;
    close();

    chrome.storage.sync.set( {
        socketPort: port,
    } );
}

/**
 * Scrape selection callback
 *
 * @param info
 * @param tab
 */
function scrapeSelection(info, tab) {
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

    console.log(info.pageUrl);
    console.log(info.selectionText);

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

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        const headline = tabs[0].title;
        let data = {type: "newNote", headline: headline, text: info.selectionText, pageUrl: info.pageUrl};
        WebSocketClient.sendData(data);
    });
}

function getServerUrl() {
    return serverUrl + ":" + socketPort;
}

function resetSettings() {
    chrome.storage.sync.clear();
    socketPort = 22222;
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

chrome.storage.sync.get( function ( data ) {
    const port = data.socketPort;

    if (port !== null && !isNaN(port)) {
        socketPort = parseInt(data.socketPort);
        console.log("socketPort from settings");
        console.log(socketPort);
    }
} );

// chrome.contextMenus.create({
//     "title": "Create note from page", "contexts": ["page"],
//     "onclick": genericOnClick
// });

const mainMenu = chrome.contextMenus.create({
    "title": "QOwnNotes", "contexts": ["page", "selection"]
});

chrome.contextMenus.create({
    "title": "Create note from selection", "contexts": ["selection"],
    "onclick": scrapeSelection, "parentId": mainMenu
});

chrome.contextMenus.create({
    "contexts": ["page", "selection"], "type": "separator", "parentId": mainMenu
});

const settingsMenu = chrome.contextMenus.create({
    "title": "Settings", "parentId": mainMenu, "contexts": ["page", "selection"]
});

chrome.contextMenus.create({
    "title": "Set socket port", "parentId": settingsMenu, "contexts": ["page", "selection"],
    "onclick": setSocketPort
});

const debugMenu = chrome.contextMenus.create({
    "title": "Debug", "parentId": mainMenu, "contexts": ["page", "selection"]
});

chrome.contextMenus.create({
    "title": "Reset settings", "parentId": debugMenu, "contexts": ["page", "selection"],
    "onclick": resetSettings
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
    alert("Connection to QOwnNotes failed!\n" + event.data);
};

let addMessage = function (data, type) {
    console.log(type);
    console.log(data);
};

WebSocketClient = {
    sendData: function (data) {
        sendText = JSON.stringify(data);

        if (!connected) {
            // open will send the message
            open();
        } else {
            sendMessageToSocket();
        }
    }
};
