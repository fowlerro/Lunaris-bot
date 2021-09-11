const { GraphQLString } = require("graphql");
const { GuildConfigType } = require("./types/GuildConfig");
const { GuildConfigInput } = require("./inputs/GuildConfig");
const Guilds = require("../../../modules/Guilds");

// TODO [Object: null prototype] in inputs (GuildConfigLogsInput)
// Temporarily solution: JSON.parse(JSON.stringify(updatedElements))

const updateGuildConfig = {
    type: GuildConfigType,
    args: {
        guildId: { type: GraphQLString },
        guildConfig: { type: GuildConfigInput }
    },
    async resolve(parent, args, request) {
        const { guildId, guildConfig } = args;
        if(!guildId || !guildConfig || !request.user) return null;
        const config = await Guilds.config.set(global.client, guildId, JSON.parse(JSON.stringify(guildConfig)))
        return config ? config : null;
    }
}

module.exports = { updateGuildConfig }