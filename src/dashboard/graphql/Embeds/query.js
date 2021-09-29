const { GraphQLString, GraphQLList, GraphQLID } = require('graphql')
const { MessageEmbedType } = require("./types/MessageEmbed");
const Embed = require("../../../database/schemas/Embed");

const getEmbedMessage = {
    type: MessageEmbedType,
    args:  {
        id: { type: GraphQLID }
    },
    resolve(parent, args, request) {
        const { id } = args
        if(!request.user || !id) return null
        return Embed.findOne({ _id: id })
    }
}

const getEmbedMessages = {
    type: new GraphQLList(MessageEmbedType),
    args:  {
        guildId: { type: GraphQLString }
    },
    resolve(parent, args, request) {
        if(!request.user) return null
        const { guildId } = args
        if(guildId) return Embed.find({ guildId })
        return Embed.find()
    }
}

module.exports = { getEmbedMessage, getEmbedMessages }