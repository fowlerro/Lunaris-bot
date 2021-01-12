const messages = {
    pl: {
        cmdGlobalStatus: "Komenda jest chwilowo wyłączona",
        prefixMessage: "Prefix dla tego serwera to: %VAR%",

        languageListMessage: "Lista wspieranych języków:",
        languageListFooter: "Wpisz %VAR%language <język>, aby zmienić język",
        wrongLanguage: "Ten język jest nieobsługiwany, wpisz '%VAR%language', aby sprawdzić listę wspieranych języków",

        prefixChange: "Prefix został pomyślnie zmieniony na %VAR%",
        languageChange: "Język został pomyślnie zmieniony na %VAR%",

        memberLogCreatedAt: "Konto utworzone",
        memberLogJoinedAt: "Dołączył",
        memberJoinedLogTitle: "%VAR% dołączył",
        memberLeavedLogTitle: "%VAR% opuścił serwer",

        memberNicknameChangedLogTitle: "Nickname %VAR% został zmieniony",
        memberNicknameCreatedLogTitle: "Nickname %VAR% został stworzony",
        memberNicknameRemovedLogTitle: "Nickname %VAR% zostal usunięty",
        memberNicknameChangedLogDesc: "%VAR% zmienił nick użytkownikowi %VAR%",
        memberNicknameCreatedLogDesc: "%VAR% stworzył nick użytkownikowi %VAR%",
        memberNicknameRemovedLogDesc: "%VAR% usunął nick użytkownikowi %VAR%",
        memberNicknameLogOld: "Stary nickname",
        memberNicknameLogNew: "Nowy nickname",
    },
    en: {
        cmdGlobalStatus: "Command is temporary turned off",
        prefixMessage: "Prefix for this server is set to: %VAR%",
        languageListMessage: "Supported languages:",
        languageListFooter: "Type %VAR%language <language> to change it",
        wrongLanguage: "This language is not supported, type '%VAR%language' to see supported languages list",

        prefixChange: "Prefix has been changed to %VAR%",
        languageChange: "Language has been changed to %VAR%",

        memberLogCreatedAt: "Account created at",
        memberLogJoinedAt: "Account joined at",
        memberJoinedLogTitle: "%VAR% joined",
        memberLeavedLogTitle: "%VAR% leaved",

        memberNicknameChangedLogTitle: "Nickname %VAR% has been changed",
        memberNicknameCreatedLogTitle: "Nickname %VAR% has been created",
        memberNicknameRemovedLogTitle: "Nickname %VAR% has been removed",
        memberNicknameChangedLogDesc: "%VAR% changed %VAR% nickname",
        memberNicknameCreatedLogDesc: "%VAR% created %VAR% nickname",
        memberNicknameRemovedLogDesc: "%VAR% removed %VAR% nickname",
        memberNicknameLogOld: "Old nickname",
        memberNicknameLogNew: "New nickname",
    }
};

const getLocale = (language, message, ...vars) => {
    let locale = messages[language][message];

    for(let count = 0; count<=vars.length; count++) {
        locale = locale.replace(/%VAR%/, () => vars[count] !== null ? vars[count] : "%VAR%");
    }

    return locale;
}

const localeList = () => {
    return Object.getOwnPropertyNames(messages);
}

module.exports = {getLocale, localeList};