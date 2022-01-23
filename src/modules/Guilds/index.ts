import { Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";
import { GuildConfigModel } from "../../database/schemas/GuildConfig";
import { GuildConfig } from "types";

class GuildsModule extends BaseModule {
    constructor() {
        super('Guilds', true)
    }

    async run() {
        console.log(this.getName())
        await createNewGuildConfigs()
    }

    config = {
        get: async (guildId: Snowflake): Promise<GuildConfig | undefined> => {
            const json = await redis.guildConfigs.getEx(guildId, { EX: 60 * 5 })
            if(json) return JSON.parse(json) as GuildConfig

            const document = await GuildConfigModel.findOne({ guildId }).select('-_id -__v')
            if(!document) return this.config.create(guildId)

            const config = document.toObject()
            await redis.guildConfigs.setEx(guildId, 60 * 5, JSON.stringify(config))
            return config
        },
        set: async (guildId: Snowflake, toSet: any): Promise<GuildConfig | undefined> => {
            const document = await GuildConfigModel.findOneAndUpdate({ guildId }, toSet, { new: true, upsert: true }).select('-_id -__v').catch(() => {})
            if(!document) return
            
            const config = document.toObject()
            await redis.guildConfigs.setEx(guildId, 60 * 5, JSON.stringify(config))
            return config;
        },        
        create: async (guildId: Snowflake): Promise<GuildConfig | undefined> => {
            const document = await GuildConfigModel.create({ guildId }).catch(() => {})
            if(!document) return

            const config = document.toObject()
            delete config._id
            delete config.__v
            await redis.guildConfigs.setEx(guildId, 60 * 5, JSON.stringify(config))

            return config
        },
        delete: async (guildId: Snowflake) => {
            await redis.guildConfigs.del(guildId)
            await GuildConfigModel.deleteOne({ guildId });
        }
    }
}

async function createNewGuildConfigs() {
    const allGuilds = await client.guilds.fetch().catch(() => {})
    if(!allGuilds) return
    const allConfigs = await GuildConfigModel.find({}, 'guildId').catch(() => {})
    if(!allConfigs) return
    if(allGuilds.size <= allConfigs.length) return;
    console.log({ allGuilds, allConfigs })
    
    allGuilds.forEach(async(guild) => {
        if(allConfigs.some(g => g.guildId !== guild.id)) await GuildConfigModel.create({ guildId: guild.id }) // TODO Remove guild from allGuilds after creating config for it
    })
}

export default new GuildsModule()