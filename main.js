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
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));

    console.log(info.pageUrl);
    console.log(info.selectionText);

    let selection = window.getSelection().toString();
    console.log(selection);

    let headline = "New note";

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        headline = tabs[0].title;
        let data = {type: "newNote", headline: headline, text: info.selectionText, pageUrl: info.pageUrl};
        WebSocketClient.sendData(data);
    });
}


chrome.contextMenus.create({"title": "Create note from selection", "contexts":["selection"],
    "onclick": scrapeSelection});

new function() {
    let ws = null;
    let connected = false;
    let serverUrl = "ws://127.0.0.1:22223";
    let sendText = "";

    let open = function() {
        ws = new WebSocket(serverUrl);
        ws.onopen = onOpen;
        ws.onclose = onClose;
        ws.onmessage = onMessage;
        ws.onerror = onError;

    };

    let close = function() {
        if (ws) {
            console.log('CLOSING ...');
            ws.close();
        }
        connected = false;
    };

    let onOpen = function() {
        console.log('OPENED: ' + serverUrl);
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

    let onClose = function() {
        console.log('CLOSED: ' + serverUrl);
        ws = null;
        connected = false;
    };

    let onMessage = function(event) {
        addMessage(event.data);
    };

    let onError = function(event) {
        alert("Connection to QOwnNotes failed!\n" + event.data);
    };

    let addMessage = function(data, type) {
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
};

// chrome.contextMenus.create({"title": "Create note from page", "contexts":["page"],
//     "onclick": genericOnClick});
