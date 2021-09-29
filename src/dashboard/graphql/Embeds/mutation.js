const { GraphQLString } = require("graphql")
const { MessageEmbedType } = require("./types/MessageEmbed")
const Embed = require("../../../database/schemas/Embed")
const Guilds = require("../../../modules/Guilds")
const { translate } = require("../../../utils/languages/languages")

const createEmbedMessage = {
    type: MessageEmbedType,
    args: {
        guildId: { type: GraphQLString },
    },
    async resolve(parent, args, request) {
        const { guildId } = args
        if(!request.user || !guildId) return null
        const { language } = Guilds.config.get(global.client, guildId)
        const name = translate(language, 'dashboard.embeds.newEmbed')
        if(!name) return null
        return Embed.create({ guildId, name }).catch(e => null)
    }
}

module.exports = { createEmbedMessage }