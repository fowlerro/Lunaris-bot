const Profile = require("../../database/schemas/Profile");

async function setProfile(userId, fieldToSet, valueToSet) {
    return Profile.findOneAndUpdate( { userId }, {
        [fieldToSet]: valueToSet
    }, { new: true, upsert: true });
}

module.exports = { setProfile }