/*
 * Get localization
 */
export const getLocale = (msg) => {
    const string = chrome.i18n.getMessage(msg);

    if (string === '') {
        throw new Error(`No Message found for "${msg}" in locales`);
    }

    return string;
};
