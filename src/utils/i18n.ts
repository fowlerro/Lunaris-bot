import i18n, { ConfigurationOptions, Replacements } from "i18n";
import path from "path";

import { LocalePhrase } from "../types/locales";

export default {
    locales: ['en', 'pl'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '../locales'),
    retryInDefaultLocale: true,
    objectNotation: true
} as ConfigurationOptions

export function translate(phrase: LocalePhrase, locale: string | undefined = 'en', variables: Replacements = {}) {
    return i18n.__({ phrase, locale }, variables)
}