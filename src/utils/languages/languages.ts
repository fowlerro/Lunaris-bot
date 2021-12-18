import fs from 'fs'
import path from 'path'

const fallbackLanguage = 'en';

export function translate(language: string, message: string, ...vars: any[]) {
    let locale = readMessage(language, message);
    if(!locale) {
        const langs = localeList().filter(el => el !== language || el !== fallbackLanguage);
        locale = readMessage(fallbackLanguage, message);
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

export function localeList() {
    const dirPath = path.resolve(__dirname);
    let files = fs.readdirSync(dirPath);
    return files.filter(el => path.extname(el) === '.json').map(el => el.slice(0, -5))
}

function readMessage(language: string, message: string): string {
    if(!localeList().includes(language)) language = fallbackLanguage;
    const filePath = path.join(__dirname, `${language}.json`);
    const json = JSON.parse(fs.readFileSync(filePath).toString());
    return message.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null
    }, json);
}