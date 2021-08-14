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