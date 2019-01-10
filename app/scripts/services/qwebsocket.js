import * as util from "../util";

export class QWebSocket {
    constructor(messageCallback) {
        this.isConnected = false;
        this.socket = null;
        this.socketPort = 22222;
        this.sendQueue = "";
        this.messageCallback = messageCallback;

        // ES5 workaround to access "this" in the "chrome.storage.sync.get" call
        var that = this;

        chrome.storage.sync.get( function ( data ) {
            const port = data.socketPort;

            if (port !== null && !isNaN(port)) {
                that.socketPort = parseInt(data.socketPort);
            }

            // that.socket = new WebSocket(that.getServerUrl());

            // that.socket.addEventListener('open', function (event) {
            //     console.log(event);
            //     that.socket.send('Hello Server!');
            // });

            // that.socket.onmessage = that.onMessage;
            // that.socket.onerror = that.onError;
            // that.socket.onclose = that.onClose();
            // that.socket.onopen = that.onOpen();


            const ws = new WebSocket(that.getServerUrl());
            that.socket = ws;
            ws.onerror = that.onError;
            // ws.onmessage = that.onMessage;
            ws.onmessage = messageCallback;
            ws.onclose = that.onClose;
            ws.onopen = that.onOpen();
            console.log(that);
        } );
    }

    onOpen(event) {
        this.isConnected = true;
        console.log('OPENED: ' + this.getServerUrl() + ' - ' + event);
        console.log(this);

        // if (this.sendQueue !== "") {
        //     console.log(this.socket);
        //     this.socket.send(this.sendQueue);
        // }
    }

    onClose(event) {
        console.log('CLOSED: ' + this.getServerUrl() + ' - ' + event.code + ' - ' + event.reason);
        // this.socket = null;
        this.isConnected = false;
        console.log(this);
    };

    // onMessage(event) {
    //     // addMessage(event.data, event.type);
    // };

    onMessage = function (event) {
        console.log(event);
        // addMessage(event.data, event.type);

        var server_message = event.data;
        console.log("message:" + server_message);
        console.log(event);
        console.log(messageCallback);

        if (this.messageCallback !== undefined) {
            this.messageCallback(event);
        }
        return false;
    };

    onError(event) {
        alert('Socket error: ' + event.data);
    }

    getServerUrl = function () {
        // return "ws://echo.websocket.org";
        return "ws://127.0.0.1:" + this.socketPort;
    };

    // getServerUrl() {
    //     // return "ws://echo.websocket.org";
    //     return "ws://127.0.0.1:" + this.socketPort;
    // }

    // send(text) {
    //     if (this.isConnected) {
    //         this.socket.send(text);
    //     } else {
    //         this.sendQueue = text;
    //     }
    // }

    send = function (message, callback) {
        let that = this;
        message = JSON.stringify(message);

        this.waitForConnection(function () {
            that.socket.send(message);

            if (typeof callback !== 'undefined') {
                callback();
            }
        });
    };

    waitForConnection = function (callback, interval, maxRetries) {
        if (maxRetries === undefined) {
            maxRetries = 10;
        }

        if (interval === undefined) {
            interval = 1000;
        }

        console.log(this.socket);
        if (this.isConnected && this.socket.readyState === 1) {
            callback();
        } else {
            if (maxRetries <= 0) {
                return;
            }

            let that = this;

            setTimeout(function () {
                console.log("Trying to send (" + maxRetries + " retries)...");
                that.waitForConnection(callback, interval, maxRetries - 1);
            }, interval);
        }
    };
}
