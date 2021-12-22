import { Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";
import { GuildConfigDocument, GuildConfigModel } from "../../database/schemas/GuildConfig";

class GuildsModule extends BaseModule {
    constructor() {
        super('Guilds', true)
    }

    async run() {
        console.log(this.getName())
        await createNewGuildConfigs()
    }

    config = {
        get: async (guildId: Snowflake): Promise<GuildConfigDocument> => {
            let config: GuildConfigDocument | undefined | null = client.guildConfigs.get(guildId)
            if(config) return config

            config = await GuildConfigModel.findOne({ guildId }).select('-_id -__v')
            if(config) return config

            config = await this.config.create(guildId)
            client.guildConfigs.set(guildId, config)
            return config
        },
        set: async (guildId: Snowflake, toSet: any): Promise<GuildConfigDocument> => {
            const config = await GuildConfigModel.findOneAndUpdate({ guildId }, toSet, { new: true, upsert: true }).select('-_id -__v')
            client.guildConfigs.set(guildId, config);
            return config;
        },        
        create: async (guildId: Snowflake) => {
            const config: GuildConfigDocument = await GuildConfigModel.create({ guildId }) // TODO Remove _id and __v from returned document
            return config
        },
        delete: async (guildId: Snowflake) => {
            client.guildConfigs.delete(guildId);
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
        if(allConfigs.some(g => g.guildId !== guild.id)) await GuildConfigModel.create({ guildId: guild.id })
    })
}

export default new GuildsModule()