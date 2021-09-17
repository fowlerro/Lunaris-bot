const mongoose = require('mongoose');

const AutoRoleSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    roles: [{
        roleId: mongoose.SchemaTypes.String,
        time: mongoose.SchemaTypes.String,
    }],
});

module.exports = mongoose.model('AutoRole', AutoRoleSchema);