const { GraphQLString, GraphQLList } = require("graphql");
const { getBotGuilds, getUserGuilds, getRolesFromGuild } = require("../../utils/api");
const { getGuilds } = require('../../utils/utils');
const { MutualGuildType, GuildRoleType } = require("./types/Guild");
const { GuildConfigType } = require("./types/GuildConfig");
const Guilds = require("../../../modules/Guilds");

const getMutualGuilds = {
    type: MutualGuildType,
    async resolve(parent, args, request) {
        if(request.user) {
            const botGuilds = await getBotGuilds();
            const userGuilds = await getUserGuilds(request.user.discordId);
            return getGuilds(userGuilds, botGuilds);
        }
        return null
    }
}

const getGuildConfig = {
    type: GuildConfigType,
    args: {
        guildId: { type: GraphQLString },
    },
    async resolve(parent, args, request) {
        const { guildId } = args;
        if(!guildId || !request.user) return null;
        const config = await Guilds.config.get(global.client, guildId)
        return (config && !config.error) ? config : null;
    }
}
const getGuildRoles = {
    type: GraphQLList(GuildRoleType),
    args: {
        guildId: { type: GraphQLString },
    },
    async resolve(parent, args, request) {
        const { guildId } = args;
        if(!guildId || !request.user) return null;
        return getRolesFromGuild(guildId);
    }
}

module.exports = { getMutualGuilds, getGuildConfig, getGuildRoles }