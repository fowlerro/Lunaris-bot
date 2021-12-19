import CryptoJS from 'crypto-js'
import { APIGuild } from 'discord.js/node_modules/discord-api-types'

export function getGuilds(userGuilds: APIGuild[], botGuilds: APIGuild[]) {
    const validGuilds = userGuilds.filter(guild => (Number(guild.permissions) & 0x20) === 0x20)
    const included: APIGuild[] = []
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