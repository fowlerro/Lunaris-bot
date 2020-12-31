const mongoose = require('mongoose');

const CooldownSchema = new mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    cmdName: {
        type: mongoose.SchemaTypes.String,
    },
    cooldown: {
        type: mongoose.SchemaTypes.Number,
        default: null,
    }
});

module.exports = mongoose.model('Cooldown', CooldownSchema);