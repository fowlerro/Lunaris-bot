const GuildConfig = require("../../database/schemas/GuildConfig");

module.exports = {
    name: "Guilds",
    enabled: true,
    async run(client) {

    },

    config: {
        async get(client, guildId) {
            let config = client.guildConfigs.get(guildId);
            if(!config) {
                config = await GuildConfig.findOne({ guildId }).select('-_id -__v')
                if(!config) return { error: "Couldn't find guild config" }
                client.guildConfigs.set(guildId, config);
            }
            return config;
        },
        async set(client, guildId, toSet, value) {
            const config = await GuildConfig.findOneAndUpdate({ guildId }, {
                [toSet]: value
            }, { new: true }).select('-_id -__v');
            client.guildConfigs.set(guildId, config);
            return config;
        },        
        async create(client, guildId) {
            await GuildConfig.create({ guildId });
            return this.get(client, guildId);
        },
        async delete(client, guildId) {
            client.guildConfigs.delete(guildId);
            await GuildConfig.deleteOne({ guildId });
        }
    }
}