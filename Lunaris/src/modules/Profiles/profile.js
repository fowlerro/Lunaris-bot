const { createCanvas, loadImage } = require('canvas');
const { join } = require('path')
const Profile = require("../../database/schemas/Profile");

async function getProfile(userId) {
    const profile = await Profile.findOne({ userId });
    if(!profile) return Profile.create({ userId });
    return profile;
}

async function setProfile(userId, fieldToSet, valueToSet) {
    return Profile.findOneAndUpdate( { userId }, {
        [fieldToSet]: valueToSet
    }, { new: true, upsert: true });
}

async function generateProfileCard(profile) {
    const canvas = createCanvas(700, 350);
    const ctx = canvas.getContext('2d');

    let backgroundImage;
    if(profile.cardAppearance.customBackground) {
        backgroundImage = await loadImage(profile.cardAppearance.customBackground);
    } else backgroundImage = await loadImage(join(__dirname, 'assets', 'backgrounds', `${profile.cardAppearance.background}.png`))
    ctx.drawImage(backgroundImage, 0, 0, 700, 350);

    return canvas.toBuffer();
}

module.exports = { getProfile, generateProfileCard, setProfile }