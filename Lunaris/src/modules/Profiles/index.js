const { Collection } = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
const { join } = require('path');
const cron = require('node-cron');
const GuildMembers = require("../../database/schemas/GuildMembers");
const Profile = require("../../database/schemas/Profile");
// TODO Remove after some time guild profiles from users who leaved a server
// TODO Add property `isInGuild` to GuildMembers schema. Extra check for rankings, etc.
module.exports = {
    name: "Profiles",
    enabled: true,
    lastSave: 0,
    async run(client) {
        client.profiles = new Collection();
        client.guildMembers = new Collection();

        cron.schedule('*/5 * * * *', async () => {
            this.lastSave = Date.now()
            await saveGuildMembers(client);
            await saveProfiles(client);
        })
    },
    async get(client, userId, guildId) {
        if(guildId) {
            let profile = client.guildMembers.get(guildId)?.find(member => member.userId === userId);
            if(!profile) {
                profile = await GuildMembers.findOne({ guildId, userId });
                if(!profile) return createProfile(client, userId, guildId);
                if(client.guildMembers.size) 
                    client.guildMembers.set(guildId, [profile, ...client.guildMembers?.get(guildId)]);
                else
                    client.guildMembers.set(guildId, [profile]);
            }
            return profile;
        }

        let profile = client.profiles.get(userId);
        if(!profile) {
            profile = await Profile.findOne({ userId });
            if(!profile) return createProfile(client, userId);
            client.profiles.set(userId, profile);
        }
        return profile;
    },

    async generateCard(member, guildProfile, globalProfile, avatarURL, isGlobal) {
        const canvas = createCanvas(1200, 660);
        const ctx = canvas.getContext('2d');
        const profile = isGlobal ? globalProfile : guildProfile;
    
        await drawXpBars(ctx, profile);
        await drawLevelRings(ctx, profile);
        await drawAvatar(ctx, avatarURL);
        await drawBackground(ctx, globalProfile);
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
        ctx.fillText(globalProfile.coins, 945.42+118.27, 84.28+(76.26/2), 140);
    
        await drawTextXPData(ctx, profile, isGlobal);
        await drawVoiceXPData(ctx, profile, isGlobal);
    
    
        return canvas.toBuffer();
    },
    neededXp,
    getTextRank, getVoiceRank
}

function neededXp(level) {
    return level * (200 + level * 15);
}

async function getTextRank(guildId, userId, isGlobal) {
    let collections = isGlobal ? await Profile.find({}) : await GuildMembers.find({ guildId });
    collections = collections.sort((a, b) => b.statistics.text.totalXp - a.statistics.text.totalXp)

    return collections.findIndex(x => x.userId === userId) + 1;
}
async function getVoiceRank(guildId, userId, isGlobal) {
    let collections = isGlobal ? await Profile.find({}) : await GuildMembers.find({ guildId });
    collections = collections.sort((a, b) => b.statistics.voice.totalXp - a.statistics.voice.totalXp)

    return collections.findIndex(x => x.userId === userId) + 1;
}

async function createProfile(client, userId, guildId) {
    if(guildId) {
        const profile = await GuildMembers.create({ userId, guildId });
        if(client.guildMembers.get(guildId))
            client.guildMembers.set(guildId, [profile, ...client.guildMembers.get(guildId)])
        else
            client.guildMembers.set(guildId, [profile]);
        return profile;
    }

    const profile = await Profile.create({ userId });
    client.profiles.set(userId, profile);
    return profile;
}

async function saveProfiles(client) {
    const bulk = Profile.collection.initializeOrderedBulkOp();
    client.profiles.forEach(profile => {
        bulk.find({ userId: profile.userId }).replaceOne(profile);
    });

    await bulk.execute();
}

async function saveGuildMembers(client) {
    const bulk = GuildMembers.collection.initializeOrderedBulkOp();
    client.guildMembers.forEach(guild => {
        guild.forEach(profile => {
            bulk.find({ guildId: profile.guildId, userId: profile.userId }).replaceOne(profile);
        })
    });
    await bulk.execute();
}





async function drawAvatar(ctx, avatarURL) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(130, 130, 115, 0, 2 * Math.PI);
    ctx.clip();
    const avatar = await loadImage(avatarURL);
    ctx.drawImage(avatar, 0, 0, 250, 250);
    ctx.closePath();
    ctx.restore();
}

async function drawBackground(ctx, globalProfile) {
    let backgroundImage;
    if(globalProfile.cardAppearance.customBackground) {
        backgroundImage = await loadImage(globalProfile.cardAppearance.customBackground);
    } else backgroundImage = await loadImage(join(__dirname, 'assets', 'backgrounds', `${globalProfile.cardAppearance.background}.svg`))
    ctx.drawImage(backgroundImage, 0, 0, 1200, 660);
}

async function drawNickname(ctx, member) {
    const nicknameBg = await loadImage(join(__dirname, 'assets', 'elements', 'NicknameField.svg'));
    ctx.drawImage(nicknameBg, 532, 4, 376, 128);
    ctx.font = "30px Roboto";
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(member.user.tag, 536+(368/2), 6+(124/2));
}

async function drawTextXPData(ctx, profile, isGlobal) {
    ctx.fillStyle = '#FFF';
    ctx.font = `30px Roboto`;
    ctx.textAlign = 'center';

    ctx.fillText(profile.statistics.text.level, 232 + 48, 330 + 48, 90);
    ctx.fillText(profile.statistics.text.dailyXp, 340 + 75, 418 + 30, 150);
    ctx.fillText(profile.statistics.text.totalXp, 874 + 75, 418 + 30, 150);

    const xpNeeded = neededXp(profile.statistics.text.level);
    ctx.fillText(`${profile.statistics.text.xp}/${xpNeeded}`, 583 + 99, 418 + 30, 190);

    // Ranking
    const rank = await getTextRank(profile.guildId, profile.userId, isGlobal);
    ctx.fillText(`#${rank}`, 76 + 71, 348 + 30, 140);
}

async function drawVoiceXPData(ctx, profile, isGlobal) {
    ctx.fillStyle = '#FFF';
    ctx.font = `30px Roboto`;
    ctx.textAlign = 'center';

    ctx.fillText(profile.statistics.voice.level, 232 + 48, 488 + 48, 90);
    ctx.fillText(profile.statistics.voice.dailyXp, 340 + 75, 576 + 30, 150);
    ctx.fillText(profile.statistics.voice.totalXp, 874 + 75, 576 + 30, 150);

    const xpNeeded = neededXp(profile.statistics.voice.level);
    ctx.fillText(`${profile.statistics.voice.xp}/${xpNeeded}`, 583 + 99, 576 + 30, 190);

    // Ranking
    const rank = await getVoiceRank(profile.guildId, profile.userId, isGlobal);
    ctx.fillText(`#${rank}`, 76 + 71, 506 + 30, 140);
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

    const gradientRing = await loadImage(join(__dirname, 'assets', 'elements', 'LevelRing.png'));
    ctx.drawImage(gradientRing, 228, 324, 106, 106);
    ctx.drawImage(gradientRing, 228, 484, 106, 106);

    ctx.beginPath();
    ctx.strokeStyle = '#36393F';
    ctx.lineWidth = '14';
    xTextPercentage === 90 ? ctx.arc(232 + 48, 330 + 48, 42, 0, 2 * Math.PI) : ctx.arc(232 + 48, 330 + 48, 42, xTextPercentage * Math.PI / 180, 90 * Math.PI / 180);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    xVoicePercentage === 90 ? ctx.arc(232 + 48, 488 + 48, 42, 0, 2 * Math.PI) : ctx.arc(232 + 48, 488 + 48, 42, xVoicePercentage * Math.PI / 180, 90 * Math.PI / 180);
    ctx.stroke();
    ctx.closePath();
}