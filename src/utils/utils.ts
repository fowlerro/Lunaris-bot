import { ActivityType, ChannelMention, Guild, MemberMention } from "discord.js";
import { Snowflake } from "discord-api-types";

export const botOwners = ["313346190995619841"];

interface IPalette {
    primary: `#${string}`
    secondary: string
    success: `#${string}`
    info: `#${string}`
    error: `#${string}`
}

export const palette: IPalette = {
    primary: '#102693',
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

export function setActivity(type: ActivityType, activity: string) {
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