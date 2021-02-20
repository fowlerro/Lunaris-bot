const mongoose = require('mongoose');
const shortid = require('shortid');

const GuildMembersSchema = new mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true,
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
        time: {
            type: mongoose.SchemaTypes.Number,
        },
        date: {
            type: mongoose.SchemaTypes.Number,
            default: Date.now()
        },
    }],
});

module.exports = mongoose.model('GuildMembers', GuildMembersSchema);