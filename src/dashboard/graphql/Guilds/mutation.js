const { GraphQLString } = require("graphql")
const { GuildConfigType } = require("./types/GuildConfig")
const { ClientMemberType } = require('./types/ClientMember')
const { GuildConfigInput } = require("./inputs/GuildConfig")
const { ClientMemberInput } = require('./inputs/ClientMember')
const Guilds = require("../../../modules/Guilds")

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

const updateClientMember = {
    type: ClientMemberType,
    args: {
        guildId: { type: GraphQLString },
        clientMember: { type: ClientMemberInput },
    },
    async resolve(parent, args, request) {
        const { guildId, clientMember } = args
        if(!guildId || (!clientMember && !clientMember?.nickname) || !request.user) return null
        const guild = await global.client.guilds.fetch(guildId).catch(e => {})
        if(!guild) return null
        return guild.me.setNickname(clientMember.nickname)
    }
}

module.exports = { updateGuildConfig, updateClientMember }