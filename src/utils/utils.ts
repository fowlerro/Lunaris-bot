import { ChannelMention, ExcludeEnum, Guild, MemberMention, Snowflake } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import path from "path";
import fs from 'fs'
import convert from 'color-convert'

export const botOwners = ["313346190995619841"];

interface IPalette {
    primary: `#${string}`
    secondary: string
    success: `#${string}`
    info: `#${string}`
    error: `#${string}`
}

export const palette: IPalette = {
    primary: '#1597e0',
    secondary: '',
    success: '#7BDB27',
    info: '#3C9FFC',
    error: '#B71E13',
}

export function mapToObject(map: Map<any, any>) {
    const out = Object.create(null)
    map.forEach((value, key) => {
      if(value instanceof Map) {
        out[key] = mapToObject(value)
      } else out[key] = value;
    })
    if(!out) return {}
    return out
}

export function daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
}

export function msToTime(ms: number) {
    let result = ""
    let d = Math.floor((ms/(1000*60*60*24)) % 7);
    d && (result += d+'d '); 
    let h = Math.floor((ms/(1000*60*60)) % 24);
    h && (result += h+'h '); 
    let m = Math.floor((ms/(1000*60)) % 60);
    m && (result += m+'m '); 
    let s = Math.floor((ms/(1000)) % 60);
    s && (result += s+'s '); 
    return result.trimEnd();
}

export function toggleBot(state: boolean) {
    if(!state) client.isOnline = !client.isOnline;
    if(state) client.isOnline = state;

    if(client.isOnline) {
        client.user?.setPresence({
            status: 'online',
            activities: [{
                name: client.customActivity?.name,
                type: client.customActivity?.type
            }]
        });
    }
    if(!client.isOnline) {
        client.user?.setPresence({
            status: 'invisible'
        });
    }
    return client.isOnline;
}

export function setActivity(type: ExcludeEnum<typeof ActivityTypes, "CUSTOM">, activity: string) {
    if(!type) return;
    client.customActivity = {
        name: activity,
        type
    }
    client.user?.setPresence({
        activities: [{
            name: client.customActivity.name,
            type: client.customActivity.type
        }]
    })
}

export async function getUserFromMention(mention: MemberMention | Snowflake) {
    if(!mention) return false;
    if(!isNaN(+mention)) return client.users.fetch(mention).catch(() => {});
    const matches = mention.match(/^<@!?(\d+)>$/);
    if(!matches) return false;

    return client.users.fetch(matches[1]);
}

export async function getChannelFromMention(guild: Guild, mention: ChannelMention) {
    if(!mention) return false
    const matches = mention.match(/^<#(\d+)>$/);
    if(!matches) return false;

    return guild.channels.fetch(matches[1]).catch(err => console.error(err))
}

export function assignNestedObjects(obj: any, keyPath: string[], value: any) {
    const lastKeyIndex = keyPath.length-1;
    for (let i = 0; i < lastKeyIndex; ++i) {
      const key = keyPath[i];
      if (!(key in obj)) obj[key] = {}
      obj = obj[key];
    }
    if(obj[keyPath[lastKeyIndex]]) {
        if(obj[keyPath[lastKeyIndex]].includes(value)) return;
        obj[keyPath[lastKeyIndex]] = [value, ...obj[keyPath[lastKeyIndex]]]
    } else obj[keyPath[lastKeyIndex]] = [value]
}

export function capitalize(string: string) {
    if (typeof string !== 'string') return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function convertLargeNumbers(number: number) {
    return number >= 1000000 ? Math.floor((number / 1000000) * 10) / 10 + "M" :
        number >= 1000 ? Math.floor((number / 1000) * 10) / 10 + "K" : number
}

export function compareArrayOfObjects(x: any, y: any): boolean {
    if(x.length !== y.length) return false

    for(const [index, obj] of x.entries()) {
        for(const key in obj) {
            if(x[index][key] != y[index][key]) return false
        }
    }

    return true
}

export function getCommandCategories(): string[] {
    const filePath = path.join(__dirname, '../commands');
	const files = fs.readdirSync(filePath)
    const categories = files.filter(file => {
        const stat = fs.lstatSync(path.join(filePath, file));
        return stat.isDirectory()
    }).map(file => file)

    categories.splice(1, 0, 'Modules')

    return categories.filter(category => category !== 'test')
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const supportedColorFormats = ['RGB', 'HEX', 'HSV', 'HSL', 'CMYK'] as const
export type colorFormatsType = typeof supportedColorFormats[number]

const colorRegex: { [format in colorFormatsType]: RegExp } = {
    RGB: new RegExp('^((0|255|25[0-4]|2[0-4]\\d|1\\d\\d|0?\\d?\\d)(,\\s?|\\s)(0|255|25[0-4]|2[0-4]\\d|1\\d\\d|0?\\d?\\d)(,\\s?|\\s)(0|255|25[0-4]|2[0-4]\\d|1\\d\\d|0?\\d?\\d))$'),
    HEX: new RegExp('^#?([A-Fa-f\\d]{3}|[A-Fa-f\\d]{6})$'),
    HSV: new RegExp('^((0|360|35\\d|3[0-4]\\d|[12]\\d\\d|0?\\d?\\d)(,\\s?|\\s)(0|100|\\d{1,2})%(,\\s?|\\s)(0|100|\\d{1,2})%)$'),
    HSL: new RegExp('^((0|360|35\\d|3[0-4]\\d|[12]\\d\\d|0?\\d?\\d)(,\\s?|\\s)(0|100|\\d{1,2})%(,\\s?|\\s)(0|100|\\d{1,2})%)$'),
    CMYK: new RegExp('^(0|100|\\d{1,2})%(,\\s?|\\s)(0|100|\\d{1,2})%(,\\s?|\\s)(0|100|\\d{1,2})%(,\\s?|\\s)(0|100|\\d{1,2})%$'),
}

export function convertColor(inputFormat: colorFormatsType, outputFormat: colorFormatsType, color: string) {
    const match = color.match(colorRegex[inputFormat])
    if(!match) return new Error('Color not match')
    if(inputFormat === 'RGB' && outputFormat === 'HEX') return "#"+convert.rgb.hex(Number(match[2]), Number(match[4]), Number(match[6]))
    if(inputFormat === 'RGB' && outputFormat === 'HSV') return convert.rgb.hsv(Number(match[2]), Number(match[4]), Number(match[6]))
    if(inputFormat === 'RGB' && outputFormat === 'HSL') return convert.rgb.hsl(Number(match[2]), Number(match[4]), Number(match[6]))
    if(inputFormat === 'RGB' && outputFormat === 'CMYK') return convert.rgb.cmyk(Number(match[2]), Number(match[4]), Number(match[6]))

    if(inputFormat === 'HEX' && outputFormat === 'RGB') return convert.hex.rgb(color)
    if(inputFormat === 'HEX' && outputFormat === 'HSV') return convert.hex.hsv(color)
    if(inputFormat === 'HEX' && outputFormat === 'HSL') return convert.hex.hsl(color)
    if(inputFormat === 'HEX' && outputFormat === 'CMYK') return convert.hex.cmyk(color)

    if(inputFormat === 'HSV' && outputFormat === 'RGB') return convert.hsv.rgb([Number(match[2]), Number(match[4]), Number(match[6])])
    if(inputFormat === 'HSV' && outputFormat === 'HEX') return "#"+convert.hsv.hex([Number(match[2]), Number(match[4]), Number(match[6])])
    if(inputFormat === 'HSV' && outputFormat === 'HSL') return convert.hsv.hsl([Number(match[2]), Number(match[4]), Number(match[6])])
    if(inputFormat === 'HSV' && outputFormat === 'CMYK') return convert.hsv.cmyk([Number(match[2]), Number(match[4]), Number(match[6])])

    if(inputFormat === 'HSL' && outputFormat === 'RGB') return convert.hsl.rgb([Number(match[2]), Number(match[4]), Number(match[6])])
    if(inputFormat === 'HSL' && outputFormat === 'HEX') return "#"+convert.hsl.hex([Number(match[2]), Number(match[4]), Number(match[6])])
    if(inputFormat === 'HSL' && outputFormat === 'HSV') return convert.hsl.hsv([Number(match[2]), Number(match[4]), Number(match[6])])
    if(inputFormat === 'HSL' && outputFormat === 'CMYK') return convert.hsl.cmyk([Number(match[2]), Number(match[4]), Number(match[6])])

    if(inputFormat === 'CMYK' && outputFormat === 'RGB') return convert.cmyk.rgb([Number(match[1]), Number(match[3]), Number(match[5]), Number(match[7])])
    if(inputFormat === 'CMYK' && outputFormat === 'HEX') return "#"+convert.cmyk.hex([Number(match[1]), Number(match[3]), Number(match[5]), Number(match[7])])
    if(inputFormat === 'CMYK' && outputFormat === 'HSV') return convert.cmyk.hsv([Number(match[1]), Number(match[3]), Number(match[5]), Number(match[7])])
    if(inputFormat === 'CMYK' && outputFormat === 'HSL') return convert.cmyk.hsl([Number(match[1]), Number(match[3]), Number(match[5]), Number(match[7])])

    return color
}