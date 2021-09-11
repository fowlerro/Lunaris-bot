const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQL } = require("graphql");
const { GraphQLBuffer } = require("../Scalars");

const ProfileStatsTextType = new GraphQLObjectType({
    name: 'ProfileStatsTextType',
    fields: () => ({
        level: { type: GraphQLInt },
        xp: { type: GraphQLInt },
        totalXp: { type: GraphQLInt },
        dailyXp: { type: GraphQLInt },
    })
})

const ProfileStatsVoiceType = new GraphQLObjectType({
    name: 'ProfileStatsVoiceType',
    fields: () => ({
        level: { type: GraphQLInt },
        xp: { type: GraphQLInt },
        totalXp: { type: GraphQLInt },
        dailyXp: { type: GraphQLInt },
        timeSpent: { type: GraphQLInt },
    })
})

const ProfileStatsType = new GraphQLObjectType({
    name: 'ProfileStatsType',
    fields: () => ({
        text: { type: ProfileStatsTextType },
        voice: { type: ProfileStatsVoiceType },
    })
})

const ProfileCardAppearanceType = new GraphQLObjectType({
    name: 'ProfileCardAppearanceType',
    fields: () => ({
        background: { type: GraphQLInt },
        customBackground: { type: GraphQLBuffer },
        accent: { type: GraphQLString }
    })
})

const ProfileType = new GraphQLObjectType({
    name: 'ProfileType',
    fields: () => ({
        userId: { type: GraphQLString },
        coins: { type: GraphQLInt },
        statistics: { type: ProfileStatsType },
        cardAppearance: { type: ProfileCardAppearanceType }
    })
})

module.exports = { ProfileType }