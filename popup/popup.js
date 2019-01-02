let socketPort = 22222;

function resetSettings() {
    chrome.storage.sync.clear();
    socketPort = 22222;
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

document.getElementById("sport").addEventListener("click", setSocketPort);
document.getElementById("rsettings").addEventListener("click", resetSettings);