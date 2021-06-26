const fs = require('fs');
const path = require('path');

const defaultLanguage = 'en';

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

    for(let count = 0; count<=vars.length-1; count++) {
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
    if(!localeList().includes(language)) language = defaultLanguage;
    const filePath = path.join(__dirname, `${language}.json`);
    let json = fs.readFileSync(filePath);
    json = JSON.parse(json);
    return message.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null
    }, json);
}

module.exports = {localeList, translate};