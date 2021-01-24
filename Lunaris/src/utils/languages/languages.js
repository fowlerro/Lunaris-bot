const messages = {
    pl: {
        name: "Nazwa",
        description: "Opis",
        slowMode: "Tryb powolny",
        on: "Włączone",
        off: "Wyłączone",

        cmdGlobalStatus: "Komenda jest chwilowo wyłączona",
        prefixMessage: "Prefix dla tego serwera to: %VAR%",

        languageListMessage: "Lista wspieranych języków:",
        languageListFooter: "Wpisz %VAR%language <język>, aby zmienić język",
        wrongLanguage: "Ten język jest nieobsługiwany, wpisz '%VAR%language', aby sprawdzić listę wspieranych języków",

        prefixChange: "Prefix został pomyślnie zmieniony na %VAR%",
        languageChange: "Język został pomyślnie zmieniony na %VAR%",

        memberLogCreatedAt: "Konto utworzone",
        memberLogJoinedAt: "Dołączył",
        memberLogReason: "Powód",
        memberLogRoles: "Role",
        memberLogBy: "Przez",

        allowedPermsLog: "Dodane permisje",
        deniedPermsLog: "Zabrane permisje",
        resetPermsLog: "Zresetowane permisje",

        memberJoinedLogTitle: "%VAR% dołączył",
        memberLeavedLogTitle: "%VAR% opuścił serwer",

        memberNicknameChangedLogTitle: "Nickname %VAR% został zmieniony",
        memberNicknameCreatedLogTitle: "Nickname %VAR% został ustawiony",
        memberNicknameRemovedLogTitle: "Nickname %VAR% zostal usunięty",
        memberNicknameChangedLogDesc: "%VAR% zmienił nick użytkownikowi %VAR%",
        memberNicknameCreatedLogDesc: "%VAR% stworzył nick użytkownikowi %VAR%",
        memberNicknameRemovedLogDesc: "%VAR% usunął nick użytkownikowi %VAR%",
        memberNicknameChangedBy: "Zmieniony przez",
        memberNicknameLogOld: "Stary nickname",
        memberNicknameLogNew: "Nowy nickname",

        memberKickedLogTitle: "%VAR% został wyrzucony",
        memberKickedLogDesc: "%VAR% został wyrzucony przez %VAR%",
        memberLogKickedAt: "W czasie",
        memberKickedLogTarget: "Wyrzucony",

        memberBannedLogTitle: "%VAR% został zbanowany",
        memberBannedLogDesc: "%VAR% został zbanowany przez %VAR%",
        memberLogBannedAt: "W czasie",
        memberBannedLogTarget: "Zbanowany",

        memberUnbannedLogTitle: "%VAR% został odbanowany",
        memberUnbannedLogDesc: "%VAR% został odbanowany przez %VAR%",
        memberLogUnbannedAt: "W czasie",
        memberUnbannedLogTarget: "Odbanowany",


        channel: "Kanał",
        
        channelCreatedLogTitle: "Nowy kanał został stworzony",
        channelLogCreatedAt: "W czasie",
        
        channelDeletedLogTitle: "Kanał #%VAR% został usunięty",
        channelLogDeletedAt: "W czasie",

        channelChangedLogTitle: "Kanał #%VAR% został zmodyfikowany",
        channelChangedLogOld: "Stary",
        channelChangedLogNew: "Nowy",
    },
    en: {
        name: "Name",
        description: "Description",
        slowMode: "Slow mode",
        on: "Enabled",
        off: "Disabled",

        cmdGlobalStatus: "Command is temporary turned off",
        prefixMessage: "Prefix for this server is set to: %VAR%",
        languageListMessage: "Supported languages:",
        languageListFooter: "Type %VAR%language <language> to change it",
        wrongLanguage: "This language is not supported, type '%VAR%language' to see supported languages list",

        prefixChange: "Prefix has been changed to %VAR%",
        languageChange: "Language has been changed to %VAR%",

        memberLogCreatedAt: "Account created at",
        memberLogJoinedAt: "Account joined at",
        memberLogReason: "Reason",
        memberLogRoles: "Roles",
        memberLogBy: "By",

        allowedPermsLog: "Added permissions",
        deniedPermsLog: "Revoked permissions",
        resetPermsLog: "Reset permissions",

        memberJoinedLogTitle: "%VAR% joined",
        memberLeavedLogTitle: "%VAR% leaved",

        memberNicknameChangedLogTitle: "Nickname %VAR% has been changed",
        memberNicknameCreatedLogTitle: "Nickname %VAR% has been set",
        memberNicknameRemovedLogTitle: "Nickname %VAR% has been removed",
        memberNicknameChangedLogDesc: "%VAR% changed %VAR% nickname",
        memberNicknameCreatedLogDesc: "%VAR% created %VAR% nickname",
        memberNicknameRemovedLogDesc: "%VAR% removed %VAR% nickname",
        memberNicknameChangedBy: "Changed by",
        memberNicknameLogOld: "Old nickname",
        memberNicknameLogNew: "New nickname",

        memberKickedLogTitle: "%VAR% has been kicked",
        memberKickedLogDesc: "%VAR% has been kicked by %VAR%",
        memberLogKickedAt: "Kicked at",
        memberKickedLogTarget: "Target",

        memberBannedLogTitle: "%VAR% has been banned",
        memberBannedLogDesc: "%VAR% has been banned by %VAR%",
        memberLogBannedAt: "Banned at",
        memberBannedLogTarget: "Target",

        memberUnbannedLogTitle: "%VAR% has been unbanned",
        memberUnbannedLogDesc: "%VAR% has been unbanned by %VAR%",
        memberLogUnbannedAt: "Unbanned at",
        memberUnbannedLogTarget: "Target",


        channel: "Channel",
        
        channelCreatedLogTitle: "New channel has been created",
        channelLogCreatedAt: "Created at",
        
        channelDeletedLogTitle: "Channel #%VAR% has been deleted",
        channelLogDeletedAt: "Deleted at",

        channelChangedLogTitle: "Channel #%VAR% has been changed",
        channelChangedLogOld: "Old",
        channelChangedLogNew: "New",
    }
};

const fs = require('fs');
const path = require('path');

const defaultLanguage = 'en';

const getLocale = (language, message, ...vars) => {
    let locale = messages[language][message];

    for(let count = 0; count<=vars.length; count++) {
        locale = locale.replace(/%VAR%/, () => vars[count] !== null ? vars[count] : "%VAR%");
    }

    return locale;
}

const translate = (language, message, ...vars) => {
    
    let locale = readMessage(language, message);

    if(!locale) {
        const langs = localeList().filter(el => el !== language || el !== defaultLanguage);
        locale = readMessage(defaultLanguage, message);
        if(!locale) {
            for(let i=0; i<langs.length; i++) {
                locale = readMessage(langs[i], message);
                if(locale) continue;
            }
        }
    }

    for(let count = 0; count<=vars.length; count++) {
        locale = locale.replace(/%VAR%/, () => vars[count] !== null ? vars[count] : "%VAR%");
    }
    
    return locale;
}

const localeList = () => {
    const dirPath = path.resolve(__dirname);
    let files = fs.readdirSync(dirPath);

    return files.filter(el => path.extname(el) === '.json').map(el => el.slice(0, -5))
}

const readMessage = (language, message) => {
    const filePath = path.join(__dirname, `${language}.json`);
    let json = fs.readFileSync(filePath);
    json = JSON.parse(json);
    return message.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null
    }, json);
}

module.exports = {localeList, translate};