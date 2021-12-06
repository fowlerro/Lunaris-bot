
// TODO Remove after some time guild profiles from users who leaved a server
// TODO Add property `isInGuild` to GuildMembers schema. Extra check for rankings, etc.
// TODO Optimize canvas code and organize module

import { GuildMember as DiscordGuildMember } from 'discord.js'
import { Snowflake } from 'discord-api-types';
import { createCanvas, loadImage, NodeCanvasRenderingContext2D } from 'canvas';
import { join } from 'path';
import cron from 'node-cron'

import BaseModule from "../../utils/structures/BaseModule";
import { GuildMember, GuildMemberModel } from '../../database/schemas/GuildMembers';
import { Profile, ProfileModel } from '../../database/schemas/Profile';
import { convertLargeNumbers } from '../../utils/utils';


class ProfileModule extends BaseModule {
    constructor() {
        super('Profile', true)
    }

    private _lastSave = 0
    get lastSave(): number { return this._lastSave }

    async run() {
        cron.schedule('*/5 * * * *', async () => {
            this._lastSave = Date.now()
            await saveProfiles(false) // Guild Members
            await saveProfiles(true) // Global Profiles
        })
    }

    async get(userId: Snowflake, guildId?: Snowflake) {
        const isGlobal = !Boolean(guildId)
        let profile: Profile | GuildMember | undefined | null = isGlobal ? client.profiles.get(userId) : client.guildMembers.get(`${userId}-${guildId}`)
        if(!profile) {
            profile = isGlobal ? await ProfileModel.findOne({ userId }) : await GuildMemberModel.findOne({ guildId, userId })
            if(!profile) return createProfile(userId, guildId)
        }
        // console.log({ userId, guildId, profile })
        return profile
    }

    async generateCard(member: DiscordGuildMember, guildProfile: GuildMember, globalProfile: Profile, avatarURL: string, isGlobal: boolean) {
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

        const coinsIconX = 945.42
        const coinsIconWidth = 78.32
        const coinsBackgroundY = 84.28
        const coinsBackgroundWidth = 236.54
        const coinsBackgroundHeight = 76.26

        const coinsValueTextX = coinsIconX + coinsIconWidth / 2 + (coinsBackgroundWidth - (coinsIconWidth / 2)) / 2
        const coinsValueTextY = coinsBackgroundY + coinsBackgroundHeight / 2

        ctx.fillStyle = '#FFF';
        ctx.font = `30px Roboto`;
        ctx.textAlign = 'center';
        ctx.fillText(globalProfile.coins.toString(), coinsValueTextX, coinsValueTextY, 140);
    
        await drawTextXPData(ctx, profile, isGlobal);
        await drawVoiceXPData(ctx, profile, isGlobal);
    
        return canvas.toBuffer();
    }

    // TODO TOFIX
    neededXp(level: number) { return neededXp(level) }

    async getRank(guildId: Snowflake, userId: Snowflake, xpType: 'text' | 'voice' = 'text', isGlobal: boolean = false) {
        return getRank(guildId, userId, xpType, isGlobal)
    }
}

function neededXp(level: number) {
    return level * (200 + level * 15);
}

async function getRank(guildId: Snowflake, userId: Snowflake, xpType: 'text' | 'voice' = 'text', isGlobal: boolean = false) {
    const profiles = isGlobal ? await ProfileModel.find() : await GuildMemberModel.find({ guildId })
    const sortedProfiles = profiles.sort((a, b) => b.statistics[xpType].totalXp - a.statistics[xpType].totalXp)

    return sortedProfiles.findIndex(x => x.userId === userId) + 1
}

async function createProfile(userId: Snowflake, guildId?: Snowflake) {
    const isGlobal = Boolean(guildId)
    const profile = isGlobal ? await ProfileModel.create({ userId }) : await GuildMemberModel.create({ userId, guildId })
    'guildId' in profile ? client.guildMembers.set(`${userId}-${guildId}`, profile) : client.profiles.set(userId, profile)
    return profile
}

async function saveProfiles(global: boolean) {
    const bulk = global ? ProfileModel.collection.initializeOrderedBulkOp() : GuildMemberModel.collection.initializeOrderedBulkOp()
    if(global) {
        client.profiles.forEach(profile => bulk.find({ userId: profile.userId }).replaceOne(profile))
        return bulk.execute()
    }

    client.guildMembers.forEach(profile => bulk.find({ guildId: profile.guildId, userId: profile.userId }).replaceOne(profile))
    return bulk.execute()
}





async function drawAvatar(ctx: NodeCanvasRenderingContext2D, avatarURL: string) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(130, 130, 115, 0, 2 * Math.PI);
    ctx.clip();
    const avatar = await loadImage(avatarURL);
    ctx.drawImage(avatar, 0, 0, 250, 250);
    ctx.closePath();
    ctx.restore();
}

async function drawBackground(ctx: NodeCanvasRenderingContext2D, globalProfile: Profile) {
    const customBackground = globalProfile.cardAppearance.customBackground
    const backgroundImage = customBackground ? await loadImage(customBackground) : await loadImage(join(__dirname, 'assets', 'backgrounds', `${globalProfile.cardAppearance.background}.svg`))

    ctx.drawImage(backgroundImage, 0, 0, 1200, 660);
}

async function drawNickname(ctx: NodeCanvasRenderingContext2D, member: DiscordGuildMember) {
    const nicknameBg = await loadImage(join(__dirname, 'assets', 'elements', 'NicknameField.svg'));
    ctx.drawImage(nicknameBg, 532, 4, 376, 128);
    ctx.font = "30px Roboto";
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(member.user.tag, 536+(368/2), 6+(124/2));
}

async function drawTextXPData(ctx: NodeCanvasRenderingContext2D, profile: GuildMember | Profile, isGlobal: boolean) {
    ctx.fillStyle = '#FFF';
    ctx.font = `30px Roboto`;
    ctx.textAlign = 'center';

    ctx.fillText(profile.statistics.text.level.toString(), 232 + 48, 330 + 48, 90);
    ctx.fillText(convertLargeNumbers(profile.statistics.text.dailyXp).toString(), 340 + 75, 418 + 30, 150);
    ctx.fillText(convertLargeNumbers(profile.statistics.text.totalXp).toString(), 874 + 75, 418 + 30, 150);

    const xpNeeded = neededXp(profile.statistics.text.level);
    ctx.fillText(`${convertLargeNumbers(profile.statistics.text.xp)}/${convertLargeNumbers(xpNeeded)}`, 583 + 99, 418 + 30, 190);

    // Ranking
    const rank = await getRank('guildId' in profile ? profile.guildId : '', profile.userId, 'text', isGlobal)
    ctx.fillText(`#${rank}`, 76 + 71, 348 + 30, 140);
}

async function drawVoiceXPData(ctx: NodeCanvasRenderingContext2D, profile: GuildMember | Profile, isGlobal: boolean) {
    ctx.fillStyle = '#FFF';
    ctx.font = `30px Roboto`;
    ctx.textAlign = 'center';

    ctx.fillText(profile.statistics.voice.level.toString(), 232 + 48, 488 + 48, 90);
    ctx.fillText(convertLargeNumbers(profile.statistics.voice.dailyXp).toString(), 340 + 75, 576 + 30, 150);
    ctx.fillText(convertLargeNumbers(profile.statistics.voice.totalXp).toString(), 874 + 75, 576 + 30, 150);

    const xpNeeded = neededXp(profile.statistics.voice.level);
    ctx.fillText(`${convertLargeNumbers(profile.statistics.voice.xp)}/${convertLargeNumbers(xpNeeded)}`, 583 + 99, 576 + 30, 190);

    // Ranking
    const rank = await getRank('guildId' in profile ? profile.guildId : '', profile.userId, 'voice', isGlobal)
    ctx.fillText(`#${rank}`, 76 + 71, 506 + 30, 140);
}

async function drawXpBars(ctx: NodeCanvasRenderingContext2D, profile: GuildMember | Profile) {
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

async function drawLevelRings(ctx: NodeCanvasRenderingContext2D, profile: GuildMember | Profile) {

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
    ctx.lineWidth = 14;
    xTextPercentage === 90 ? ctx.arc(232 + 48, 330 + 48, 42, 0, 2 * Math.PI) : ctx.arc(232 + 48, 330 + 48, 42, xTextPercentage * Math.PI / 180, 90 * Math.PI / 180);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    xVoicePercentage === 90 ? ctx.arc(232 + 48, 488 + 48, 42, 0, 2 * Math.PI) : ctx.arc(232 + 48, 488 + 48, 42, xVoicePercentage * Math.PI / 180, 90 * Math.PI / 180);
    ctx.stroke();
    ctx.closePath();
}

export default new ProfileModule()