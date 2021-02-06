const mongoose = require('mongoose');

const AutoRoleTimeSchema = new mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    userID: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    roles: [{
        roleID: mongoose.SchemaTypes.String,
        timestamp: mongoose.SchemaTypes.String,
    }],
});

module.exports = mongoose.model('AutoRoleTime', AutoRoleTimeSchema);