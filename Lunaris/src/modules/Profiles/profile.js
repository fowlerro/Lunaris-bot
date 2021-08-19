const { createCanvas, loadImage } = require('canvas');
const { join } = require('path')
const Profile = require("../../database/schemas/Profile");

function neededXp(level) {
    return level * (200 + level * 15);
}

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

async function generateProfileCard(member, profile, avatarURL) {
    const canvas = createCanvas(1200, 660);
    const ctx = canvas.getContext('2d');

    await drawXpBars(ctx, profile);
    await drawAvatar(ctx, avatarURL);
    await drawBackground(ctx, profile);
    await drawNickname(ctx, member);

    const overlay = await loadImage(join(__dirname, 'assets', 'elements', 'Overlay.png'));
    ctx.drawImage(overlay, 0, 0, 1200, 660);

    const messageIcon = await loadImage(join(__dirname, 'assets', 'icons', 'Message.png'));
    ctx.drawImage(messageIcon, 1050, 350, 120, 80);

    const microphoneIcon = await loadImage(join(__dirname, 'assets', 'icons', 'Microphone.png'));
    ctx.drawImage(microphoneIcon, 1086.52, 489.42, 57, 93.53);

    ctx.fillStyle = '#FFF';
    ctx.font = `30px Roboto`;
    ctx.textAlign = 'center';
    ctx.fillText(profile.coins, 945.42+118.27, 84.28+(76.26/2), 140);

    await drawTextXPData(ctx, profile);
    await drawVoiceXPData(ctx, profile);
    await drawLevelRings(ctx, profile);


    return canvas.toBuffer();
}

async function drawAvatar(ctx, avatarURL) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 125, 124, 0, 2 * Math.PI);
    ctx.clip();
    const avatar = await loadImage(avatarURL);
    ctx.drawImage(avatar, 2, 2, 250, 250);
    ctx.closePath();
    ctx.restore();
}

async function drawBackground(ctx, profile) {
    let backgroundImage;
    if(profile.cardAppearance.customBackground) {
        backgroundImage = await loadImage(profile.cardAppearance.customBackground);
    } else backgroundImage = await loadImage(join(__dirname, 'assets', 'backgrounds', `${profile.cardAppearance.background}.svg`))
    ctx.drawImage(backgroundImage, 0, 0, 1200, 660);
}

async function drawNickname(ctx, member) {
    const nicknameBg = await loadImage(join(__dirname, 'assets', 'elements', 'NicknameField.svg'));
    ctx.drawImage(nicknameBg, 536, 6, 368, 124);
    ctx.font = "30px Roboto";
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(member.user.tag, 536+(368/2), 6+(124/2));
}

async function drawTextXPData(ctx, profile) {
    ctx.fillStyle = '#FFF';
    ctx.font = `30px Roboto`;
    ctx.textAlign = 'center';

    ctx.fillText(profile.statistics.text.level, 232 + 48, 330 + 48, 90);
    ctx.fillText(profile.statistics.text.todayXp, 340 + 75, 418 + 30, 150);
    ctx.fillText(profile.statistics.text.totalXp, 874 + 75, 418 + 30, 150);

    const xpNeeded = neededXp(profile.statistics.text.level);
    ctx.fillText(`${profile.statistics.text.xp}/${xpNeeded}`, 583 + 99, 418 + 30, 190);

    // Ranking
    ctx.fillText('#0', 76 + 71, 348 + 30, 140);
}

async function drawVoiceXPData(ctx, profile) {
    ctx.fillStyle = '#FFF';
    ctx.font = `30px Roboto`;
    ctx.textAlign = 'center';

    ctx.fillText(profile.statistics.voice.level, 232 + 48, 488 + 48, 90);
    ctx.fillText(profile.statistics.voice.todayXp, 340 + 75, 576 + 30, 150);
    ctx.fillText(profile.statistics.voice.totalXp, 874 + 75, 576 + 30, 150);

    const xpNeeded = neededXp(profile.statistics.voice.level);
    ctx.fillText(`${profile.statistics.voice.xp}/${xpNeeded}`, 583 + 99, 576 + 30, 190);

    // Ranking
    ctx.fillText('#0', 76 + 71, 506 + 30, 140);
}

async function drawXpBars(ctx, profile) {
    const barImage = await loadImage(join(__dirname, 'assets', 'elements', 'XPBar.svg'));

    const xpText = profile.statistics.text.xp;
    const neededXpText = neededXp(profile.statistics.text.level);
    const xpVoice = profile.statistics.voice.xp;
    const neededXpVoice = neededXp(profile.statistics.voice.level);
    const textPercentage = Math.round((xpText / neededXpText) * 100) / 100;
    const voicePercentage = Math.round((xpVoice / neededXpVoice) * 100) / 100;
    const xTextPercentage = 688 * textPercentage;
    const xVoicePercentage = 688 * voicePercentage;

    ctx.drawImage(barImage, 338, 350, 688, 54);
    ctx.drawImage(barImage, 338, 508, 688, 54);

    ctx.fillStyle = '#36393F';
    ctx.fillRect(338 + xTextPercentage, 348, 688, 58);
    ctx.fillRect(338 + xVoicePercentage, 506, 688, 58);
    const barEndImage = await loadImage(join(__dirname, 'assets', 'elements', 'BarEnd.svg'));
    ctx.drawImage(barEndImage, 338 + xTextPercentage - 36, 349, 40, 58);
    ctx.drawImage(barEndImage, 338 + xVoicePercentage - 36, 507, 40, 58);
}

async function drawLevelRings(ctx, profile) {

    const xpText = profile.statistics.text.xp;
    const neededXpText = neededXp(profile.statistics.text.level);
    const xpVoice = profile.statistics.voice.xp;
    const neededXpVoice = neededXp(profile.statistics.voice.level);
    const textPercentage = Math.round((xpText / neededXpText) * 100) / 100;
    const voicePercentage = Math.round((xpVoice / neededXpVoice) * 100) / 100;
    const xTextPercentage = 360 * textPercentage + 90;
    const xVoicePercentage = 360 * voicePercentage + 90;

    console.log(xpText, neededXpText, textPercentage, xTextPercentage);

    ctx.beginPath();
    ctx.strokeStyle = '#36393F';
    ctx.lineWidth = '10';
    ctx.arc(232 + 48, 330 + 48, 43, xTextPercentage * Math.PI / 180, 90 * Math.PI / 180);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(232 + 48, 488 + 48, 43, xVoicePercentage * Math.PI / 180, 90 * Math.PI / 180);
    ctx.stroke();
    ctx.closePath();
}

module.exports = { getProfile, generateProfileCard, setProfile, neededXp }