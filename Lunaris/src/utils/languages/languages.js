const messages = {
    pl: {
        cmdGlobalStatus: "Komenda jest chwilowo wyłączona",
        prefixMessage: "Prefix dla tego serwera to: %VAR%",

        languageListMessage: "Lista wspieranych języków:",
        languageListFooter: "Wpisz %VAR%language <język>, aby zmienić język",
        wrongLanguage: "Ten język jest nieobsługiwany, wpisz '%VAR%language', aby sprawdzić listę wspieranych języków",

        prefixChange: "Prefix został pomyślnie zmieniony na %VAR%",
        languageChange: "Język został pomyślnie zmieniony na %VAR%",
    },
    en: {
        cmdGlobalStatus: "Command is temporary turned off",
        prefixMessage: "Prefix for this server is set to: %VAR%",
        languageListMessage: "Supported languages:",
        languageListFooter: "Type %VAR%language <language> to change it",
        wrongLanguage: "This language is not supported, type '%VAR%language' to see supported languages list",

        prefixChange: "Prefix has been changed to %VAR%",
        languageChange: "Language has been changed to %VAR%",
    }
};

const getLocale = (language, message, ...vars) => {
    let locale = messages[language][message];

    let count = 0;
    locale = locale.replace(/%VAR%/g, () => vars[count] !== null ? vars[count] : "%VAR%");

    return locale;
}

const localeList = () => {
    return Object.getOwnPropertyNames(messages);
}

module.exports = {getLocale, localeList};