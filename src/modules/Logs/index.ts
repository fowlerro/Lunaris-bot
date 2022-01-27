import { Formatters, MessageEmbed, Snowflake, TextChannel } from "discord.js";
import TextFormatter from "../../utils/Formatters/Formatter";
import BaseModule from "../../utils/structures/BaseModule";
import templates from "./templates";
import { Config } from "./types";



class LogsModule extends BaseModule {
    constructor() {
        super('Logs', true)
    }

    async run() {}

    async log(category: keyof Config, type: string, guildId: Snowflake, ...vars: any) {
        const config: Config = { members: { channelId: "795980843516297216", logs: { memberJoin: true } } }

        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return console.log('notGuild')
        const channel = await guild.channels.fetch(config[category].channelId).catch(() => {}) as TextChannel | null
        if(!channel) return console.log('notChannel')

        const embed = new MessageEmbed(templates.members.memberJoin)

        channel.send({
            embeds: [embed]
        })
    }
}

export default new LogsModule()