/*
 * Get localization
 */
export const getLocale = (msg, substitutions = []) => {
  const string = chrome.i18n.getMessage(msg, substitutions);

  if (string === "") {
    throw new Error(`No Message found for "${msg}" in locales`);
  }

  return string;
};

export const truncateText = (text, limit) => {
  if (text.length <= limit) {
    return text;
  } else {
    // Truncate the text and add ellipsis
    return text.substring(0, limit) + "…";
  }
};

export const openPrivateUrl = (url) => {
  // Check if there's an incognito window already open
  chrome.windows.getAll({ populate: true }, function (windows) {
    console.log("windows", windows);
    const incognitoWindow = windows.find((window) => window.incognito);
    console.log("incognitoWindow", incognitoWindow);
    if (incognitoWindow) {
      // If there's already an incognito window, open a new tab in it
      chrome.tabs.create({ url: url, windowId: incognitoWindow.id });
    } else {
      // If there isn't an incognito window, create one and open a tab in it
      chrome.windows.create(
        { incognito: true, url: url, focused: true },
        function (window) {
          console.log("window", window);
          // chrome.tabs.create({ url: url, windowId: window.id });
        },
      );
    }
  });
};
