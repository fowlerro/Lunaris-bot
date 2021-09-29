const { ProfileType } = require("./types/Profile");
const Profiles = require('../../../modules/Profiles')

const getProfile = {
    type: ProfileType,
    resolve(parent, args, request) {
        return request.user ? Profiles.get(global.client, request.user.discordId) : null;
    }
}

module.exports = { getProfile }