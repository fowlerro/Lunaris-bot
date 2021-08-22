const mongoose = require('mongoose');
const shortid = require('shortid');

const GuildMembersSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    statistics: {
        text: {
            level: {
                type: mongoose.SchemaTypes.Number,
                default: 1
            },
            xp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            totalXp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            dailyXp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            }
        },
        voice: {
            level: {
                type: mongoose.SchemaTypes.Number,
                default: 1
            },
            xp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            totalXp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            dailyXp: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            },
            timeSpent: {
                type: mongoose.SchemaTypes.Number,
                default: 0
            }
        }
    },
    muted: {
        isMuted: {
            type: mongoose.SchemaTypes.Boolean,
            default: false,
        },
        timestamp: {
            type: mongoose.SchemaTypes.Number,
        },
        date: {
            type: mongoose.SchemaTypes.Number,
        },
        reason: {
            type: mongoose.SchemaTypes.String,
        },
        by: {
            type: mongoose.SchemaTypes.String,
        }
    },
    warns: [{
        id: {
            type: String,
            default: shortid.generate(),
        },
        reason: {
            type: mongoose.SchemaTypes.String,
            default: null,
        },
        by: {
            type: mongoose.SchemaTypes.String,
        },
        date: {
            type: mongoose.SchemaTypes.Number,
            default: Date.now()
        },
    }],
});

module.exports = mongoose.model('GuildMembers', GuildMembersSchema);