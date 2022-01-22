import { Message, MessageEmbed, TextChannel, VoiceState, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";
import Guilds from "../Guilds";
import Profiles from "../Profiles";
import { handleVoiceXp } from "./voice";
import { GuildProfileDocument, GuildProfileModel } from "../../database/schemas/GuildProfile";
import { ProfileDocument, ProfileModel } from "../../database/schemas/Profile";
import { palette } from "../../utils/utils";

const cooldowns = new Map<string, boolean>()

// TODO Add level rewards
class XpSystemModule extends BaseModule {
    constructor() {
        super('XpSystem', true)
    }

    async run() {}

    async addTextXp(message: Message) {
        const guildId = message.guild?.id;
        if(!guildId) return
        const channelId = message.channel.id
        const userId = message.author.id;

        const guildConfig = await Guilds.config.get(guildId);
        const multiplier = guildConfig.modules?.xp?.multiplier || 1
        const xpToAdd = Math.floor(Math.random() * (35 - 20) + 20);

        await addGuildTextXp(guildId, channelId, userId, xpToAdd, multiplier);
        await addGlobalTextXp(userId, xpToAdd);
    }

    async handleVoiceXp(oldState: VoiceState, newState: VoiceState) {
        return handleVoiceXp(oldState, newState)
    }
    async resetDailyXp() {
        await GuildProfileModel.updateMany({ $or: [ { 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } } ] }, {
            'statistics.text.dailyXp': 0,
            'statistics.voice.dailyXp': 0,
        });
        await ProfileModel.updateMany({ $or: [ { 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } } ] }, {
            'statistics.text.dailyXp': 0,
            'statistics.voice.dailyXp': 0,
        });
        await redis.profiles.flushAll()
        await redis.guildProfiles.flushAll()
    }

}

async function addGuildTextXp(guildId: Snowflake, channelId: Snowflake, userId: Snowflake, xpToAdd: number, multiplier: number) {
    const guildProfile = await Profiles.get(userId, guildId) as GuildProfileDocument;
    const { level, xp } = guildProfile.statistics.text;
    if(cooldowns.get(`${guildId}-${userId}`)) return;
    cooldowns.set(`${guildId}-${userId}`, true)
    const xpNeeded = Profiles.neededXp(level);

    setTimeout(() => {
        cooldowns.set(`${guildId}-${userId}`, false)
    }, 60000);

    if(xp + (xpToAdd * multiplier) >= xpNeeded) return levelUp(guildProfile, channelId, xp, (xpToAdd * multiplier), xpNeeded);

    guildProfile.statistics.text.xp += xpToAdd * multiplier
    guildProfile.statistics.text.totalXp += xpToAdd * multiplier
    guildProfile.statistics.text.dailyXp += xpToAdd * multiplier

    await Profiles.set(guildProfile)

    return guildProfile
}

async function addGlobalTextXp(userId: Snowflake, xpToAdd: number) {
    const globalProfile = await Profiles.get(userId) as ProfileDocument;
    const { level, xp } = globalProfile.statistics.text;
    if(cooldowns.get(userId)) return;
    cooldowns.set(userId, true)
    const xpNeeded = Profiles.neededXp(level);

    setTimeout(() => {
        cooldowns.set(userId, false)
    }, 60000);

    if(xp + xpToAdd >= xpNeeded) return levelUp(globalProfile, null, xp, xpToAdd, xpNeeded, true);

    globalProfile.statistics.text.xp += xpToAdd
    globalProfile.statistics.text.totalXp += xpToAdd
    globalProfile.statistics.text.dailyXp += xpToAdd

    await Profiles.set(globalProfile)

    return globalProfile;
}

async function levelUp(profile: GuildProfileDocument | ProfileDocument, channelId: Snowflake | null, xp: number, xpToAdd: number, xpNeeded: number, isGlobal: boolean = false) {
    const rest = (xp + xpToAdd) - xpNeeded;

    profile.statistics.text.level += 1;
    profile.statistics.text.xp = rest;
    profile.statistics.text.totalXp += xpToAdd;
    profile.statistics.text.dailyXp += xpToAdd;
    

    'coins' in profile && (profile.coins += profile.statistics.text.level * (10 + profile.statistics.text.level * 2))
    'guildId' in profile && channelId && sendLevelUpMessage(profile, channelId);

    await Profiles.set(profile)

    return profile;
}

async function sendLevelUpMessage(profile: GuildProfileDocument, channelId: Snowflake) {
    const guildConfig = await Guilds.config.get(profile.guildId);
    const messageMode = guildConfig.modules.xp.levelUpMessage.mode
    if(messageMode === 'off') return;
    const guild = await client.guilds.fetch(profile.guildId).catch(() => {})
    if(!guild) return
    const configChannelId = guildConfig.modules.xp.levelUpMessage.channelId
    const channel = messageMode === 'currentChannel' ? await guild.channels.fetch(channelId) as TextChannel : configChannelId && await guild.channels.fetch(configChannelId) as TextChannel;
    if(!channel) return
    const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'


    const embed = new MessageEmbed()
        .setColor(palette.primary)
        .setDescription(t('xp.levelUpMessage', language, { level: profile.statistics.text.level.toString(), user: `<@${profile.userId}>` }));

    channel.send({ embeds: [embed] });
}

export default new XpSystemModule()