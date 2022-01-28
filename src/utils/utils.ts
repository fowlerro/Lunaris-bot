import { ExcludeEnum } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import path from "path";
import fs from 'fs'

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

export function setActivity(type: ExcludeEnum<typeof ActivityTypes, "CUSTOM">, activity?: string) {
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
    } else {
        obj[keyPath[lastKeyIndex]] = [value]
    }
}

export function capitalize(string: string) {
    if (typeof string !== 'string') return string
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function convertLargeNumbers(number: number) {
    return number >= 1000000 ? Math.floor((number / 1000000) * 100) / 100 + "M" :
        number >= 1000 ? Math.floor((number / 1000) * 10) / 10 + "K" : number
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