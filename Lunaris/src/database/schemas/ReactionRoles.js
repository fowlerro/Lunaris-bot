const mongoose = require('mongoose');

const ReactionRolesSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    channelId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    messageId: {
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