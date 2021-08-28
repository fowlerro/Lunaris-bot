const mongoose = require('mongoose');

const GuildBansSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    by: {
        type: String
    },
    reason: {
        type: String,
    },
    time: {
        type: mongoose.SchemaTypes.Date
    }
});

GuildBansSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('GuildBans', GuildBansSchema);