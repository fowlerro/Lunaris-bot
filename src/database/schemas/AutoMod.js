const mongoose = require('mongoose');

const AutoModSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    censor: {
        words: {
            type: mongoose.SchemaTypes.Array,
            unique: true
        },
        triggerValue: {
            type: mongoose.SchemaTypes.Number,
            default: 3
        }
    },
});

module.exports = mongoose.model('AutoMod', AutoModSchema);