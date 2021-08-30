const mongoose = require('mongoose');

const AutoRoleTimeSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    roles: [{
        roleId: mongoose.SchemaTypes.String,
        timestamp: mongoose.SchemaTypes.String,
    }],
});

module.exports = mongoose.model('AutoRoleTime', AutoRoleTimeSchema);