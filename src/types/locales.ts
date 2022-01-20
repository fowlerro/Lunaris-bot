import en from '../locales/en.json'
import pl from '../locales/pl.json'

type PathsToStringProps<T> = T extends (string | number | Date) ? [] : {
    [K in keyof T]: [K, ...PathsToStringProps<T[K]>]
}[keyof T];

type Join<T extends string[], D extends string> =
    T extends [] ? never :
    T extends [infer F] ? F :
    T extends [infer F, ...infer R] ?
    F extends string ? 
    `${F}${D}${Join<Extract<R, string[]>, D>}` : never : string;

export type LocalePhrase = Join<PathsToStringProps<typeof en | typeof pl>, ".">