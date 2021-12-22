import CryptoJS from 'crypto-js'

import { Guild, MutualGuilds } from 'types'

export function getGuilds(userGuilds: Guild[], botGuilds: Guild[]): MutualGuilds {
    const validGuilds = userGuilds.filter(guild => (Number(guild.permissions) & 0x20) === 0x20)
    const included: Guild[] = []
    const excluded = validGuilds.filter(userGuild => {
        const findGuild = botGuilds.find(botGuild => botGuild.id === userGuild.id)
        if(!findGuild) return userGuild
        included.push(findGuild)
    });
    
    return { excluded, included }
}

export function encrypt(token: string) {
    return CryptoJS.AES.encrypt(token, process.env.ENCRYPT_KEY!);
}

export function decrypt(token: string) {
    return CryptoJS.AES.decrypt(token, process.env.ENCRYPT_KEY!);
}