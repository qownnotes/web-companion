/*
 * Get localization
 */
export const getLocale = (msg, substitutions = []) => {
  const string = chrome.i18n.getMessage(msg, substitutions);

  if (string === '') {
    throw new Error(`No Message found for "${msg}" in locales`);
  }

  return string;
};

export const truncateText = (text, limit) => {
  if (text.length <= limit) {
    return text;
  } else {
    // Truncate the text and add ellipsis
    return text.substring(0, limit) + '…';
  }
};

export const openUrl = (url) => {
  chrome.tabs.create({ url });
}
