const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLID } = require("graphql");
const { TimestampScalar } = require('../../Scalars')

const EmbedFieldType = new GraphQLObjectType({
    name: 'EmbedFieldType',
    fields: () => ({
        name: { type: GraphQLString },
        value: { type: GraphQLString },
        inline: { type: GraphQLBoolean },
    })
})

const EmbedTimestampType = new GraphQLObjectType({
    name: 'EmbedTimestampType',
    fields: () => ({
        display: { type: GraphQLBoolean },
        timestamp: { type: TimestampScalar },
    })
})

const EmbedThumbnailType = new GraphQLObjectType({
    name: 'EmbedThumbnailType',
    fields: () => ({
        url: { type: GraphQLString },
        width: { type: GraphQLInt },
        height: { type: GraphQLInt },
    })
})

const EmbedImageType = new GraphQLObjectType({
    name: 'EmbedImageType',
    fields: () => ({
        url: { type: GraphQLString },
        width: { type: GraphQLInt },
        height: { type: GraphQLInt },
    })
})

const EmbedFooterType = new GraphQLObjectType({
    name: 'FooterType',
    fields: () => ({
        text: { type: GraphQLString },
        iconURL: { type: GraphQLString },
    })
})

const EmbedAuthorType = new GraphQLObjectType({
    name: 'EmbedAuthorType',
    fields: () => ({
        name: { type: GraphQLString },
        url: { type: GraphQLString },
        iconURL: { type: GraphQLString },
    })
})

const EmbedType = new GraphQLObjectType({
    name: 'EmbedType',
    fields: () => ({
        author: { type: EmbedAuthorType },
        color: { type: GraphQLString },
        description: { type: GraphQLString },
        footer: { type: EmbedFooterType },
        image: { type: EmbedImageType },
        thumbnail: { type: EmbedThumbnailType },
        timestamp: { type: EmbedTimestampType },
        title: { type: GraphQLString },
        url: { type: GraphQLString },
        fields: { type: new GraphQLList(EmbedFieldType) },
    })
})

const MessageEmbedType = new GraphQLObjectType({
    name: 'MessageEmbedType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        guildId: { type: GraphQLString },
        channelId: { type: GraphQLString },
        messageId: { type: GraphQLString },
        messageContent: { type: GraphQLString },
        embed: { type: EmbedType }
    })
})

module.exports = { MessageEmbedType }