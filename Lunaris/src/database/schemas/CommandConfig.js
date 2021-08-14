const mongoose = require('mongoose');

const CommandConfigSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    name: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    aliases: {
        type: mongoose.SchemaTypes.Array,
    },
    minArgs: {
        type: mongoose.SchemaTypes.Number,
    },
    maxArgs: {
        type: mongoose.SchemaTypes.Number,
    },
    autoRemove: {
        type: mongoose.SchemaTypes.Boolean,
    },
    autoRemoveResponse: {
        type: mongoose.SchemaTypes.Boolean,
    },
    status: {
        type: mongoose.SchemaTypes.Boolean,
    },
    permissions: {
        type: mongoose.SchemaTypes.Array,
    },
    allowedChannels: {
        type: mongoose.SchemaTypes.Array,
    },
    blockedChannels: {
        type: mongoose.SchemaTypes.Array,
    },
    allowedRoles: {
        type: mongoose.SchemaTypes.Array,
    },
    blockedRoles: {
        type: mongoose.SchemaTypes.Array,
    },
    cooldownStatus: {
        type: mongoose.SchemaTypes.Boolean,
    },
    cooldown: {
        type: mongoose.SchemaTypes.String,
    },
    cooldownPermissions: {
        type: mongoose.SchemaTypes.Array,
    },
    cooldownChannels: {
        type: mongoose.SchemaTypes.Array,
    },
    cooldownRoles: {
        type: mongoose.SchemaTypes.Array,
    },
    cooldownReminder: {
        type: mongoose.SchemaTypes.Boolean,
    },
});

module.exports = mongoose.model('CommandConfig', CommandConfigSchema);