import BaseModule from "../../utils/structures/BaseModule";
import { GuildConfig, GuildConfigModel } from "../../database/schemas/GuildConfig";
import { Snowflake } from "discord-api-types";
class GuildsModule extends BaseModule {
    constructor() {
        super('Guilds', true)
    }

    async run() {
        await createNewGuildConfigs()
    }

    config = {
        get: async (guildId: Snowflake): Promise<GuildConfig | null> => {
            let config: GuildConfig | undefined | null = client.guildConfigs.get(guildId);
            if(config) return config

            config = await GuildConfigModel.findOne({ guildId }).select('-_id -__v')
            if(!config) return null

            client.guildConfigs.set(guildId, config);
            return config;
        },
        set: async (guildId: Snowflake, toSet: any): Promise<GuildConfig | null> => {
            const config = await GuildConfigModel.findOneAndUpdate({ guildId }, toSet, { new: true }).select('-_id -__v');
            if(!config) return null
            client.guildConfigs.set(guildId, config);
            return config;
        },        
        create: async (guildId: Snowflake) => {
            await GuildConfigModel.create({ guildId });
            return this.config.get(guildId);
        },
        delete: async (guildId: Snowflake) => {
            client.guildConfigs.delete(guildId);
            await GuildConfigModel.deleteOne({ guildId });
        }
    }
}

export default new GuildsModule()

// module.exports = {
//     name: "Guilds",
//     enabled: true,
//     async run(client) {
//         await createNewGuildsConfigs()
//     },

//     config: {
//         async get(client, guildId) {
//             let config = client.guildConfigs.get(guildId);
//             if(!config) {
//                 config = await GuildConfig.findOne({ guildId }).select('-_id -__v')
//                 if(!config) return { error: "Couldn't find guild config" }
//                 client.guildConfigs.set(guildId, config);
//             }
//             return config;
//         },
//         async set(client, guildId, toSet) {
//             const config = await GuildConfig.findOneAndUpdate({ guildId }, toSet, { new: true }).select('-_id -__v');
//             client.guildConfigs.set(guildId, config);
//             return config;
//         },        
//         async create(client, guildId) {
//             await GuildConfig.create({ guildId });
//             return this.get(client, guildId);
//         },
//         async delete(client, guildId) {
//             client.guildConfigs.delete(guildId);
//             await GuildConfig.deleteOne({ guildId });
//         }
//     }
// }

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