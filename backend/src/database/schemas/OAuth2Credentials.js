const mongoose = require('mongoose');

const OAuth2CredentialsSchema = new mongoose.Schema({
    accessToken: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    refreshToken: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    discordID: {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model('OAuth2Credentials', OAuth2CredentialsSchema);