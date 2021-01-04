const mongoose = require('mongoose');

const ReactionRolesSchema = new mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    channelID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    messageID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    reactions: [{
        reaction: mongoose.SchemaTypes.String,
        role: mongoose.SchemaTypes.String,
        mode: mongoose.SchemaTypes.String,
    }]
});

module.exports = mongoose.model('ReactionRoles', ReactionRolesSchema);