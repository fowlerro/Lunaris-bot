const mongoose = require('mongoose');

const AutoRoleSchema = new mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    roles: [{
        roleID: mongoose.SchemaTypes.String,
        time: mongoose.SchemaTypes.String,
    }],
});

module.exports = mongoose.model('AutoRole', AutoRoleSchema);