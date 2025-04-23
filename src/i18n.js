/**
* Translations for error messages and UI elements
*/
const translations = {
    en: {
        noFileSelected: 'No file selected',
        invalidJson: 'Invalid JSON in file: {filename}',
        failedToRead: 'Failed to read file: {filename}',
        noFileDropped: 'No file dropped',
        processingFile: 'Processing file...'
    },
    de: {
        noFileSelected: 'Keine Datei ausgewählt',
        invalidJson: 'Ungültiges JSON in Datei: {filename}',
        failedToRead: 'Fehler beim Lesen der Datei: {filename}',
        noFileDropped: 'Keine Datei abgelegt',
        processingFile: 'Datei wird verarbeitet...'
    }
};

let currentLanguage = 'en';

/**
 * Get a translated message with placeholders replaced
 * @param {string} key - The translation key
 * @param {object} placeholders - Object with placeholder values
 * @returns {string} - Translated message
 */
function getMessage(key, placeholders = {}) {
    const messages = translations[currentLanguage] || translations.en;
    let message = messages[key] || translations.en[key];

    // Replace any placeholders in the message
    Object.keys(placeholders).forEach(placeholder => {
        message = message.replace(`{${placeholder}}`, placeholders[placeholder]);
    });

    return message;
}

/**
 * Set the current language for error messages
 * @param {string} languageCode - Language code ('en' or 'de')
 * @returns {boolean} - True if language changed successfully
 */
function setLanguage(languageCode) {
    if (translations[languageCode]) {
        currentLanguage = languageCode;
        return true;
    }
    return false;
}

/**
 * Get the current language code
 * @returns {string} - Current language code
 */
function getLanguage() {
    return currentLanguage;
}