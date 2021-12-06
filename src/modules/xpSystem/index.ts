import { Message, MessageEmbed, TextChannel, VoiceState } from "discord.js";
import { Snowflake } from "discord-api-types";

import BaseModule from "../../utils/structures/BaseModule";
import Guilds from "../Guilds";
import Profiles from "../Profiles";
import { handleVoiceXp } from "./voice";
import { GuildMember, GuildMemberModel } from "../../database/schemas/GuildMembers";
import { Profile, ProfileModel } from "../../database/schemas/Profile";
import { palette } from "../../utils/utils";
import { translate } from "../../utils/languages/languages";


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
        await GuildMemberModel.updateMany({ $or: [ { 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } } ] }, {
            'statistics.text.dailyXp': 0,
            'statistics.voice.dailyXp': 0,
        });
        await ProfileModel.updateMany({ $or: [ { 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } } ] }, {
            'statistics.text.dailyXp': 0,
            'statistics.voice.dailyXp': 0,
        });
        client.guildMembers.clear();
        client.profiles.clear();
    }

}

async function addGuildTextXp(guildId: Snowflake, channelId: Snowflake, userId: Snowflake, xpToAdd: number, multiplier: number) {
    const guildProfile = await Profiles.get(userId, guildId) as GuildMember;
    const { level, xp, cooldown } = guildProfile.statistics.text;
    if(cooldown) return;
    guildProfile.statistics.text.cooldown = true;
    const xpNeeded = Profiles.neededXp(level);

    setTimeout(() => {
        guildProfile.statistics.text.cooldown = false
    }, 60000);

    if(xp + (xpToAdd * multiplier) >= xpNeeded) return levelUp(guildProfile, channelId, xp, (xpToAdd * multiplier), xpNeeded);

    guildProfile.statistics.text.xp += xpToAdd * multiplier
    guildProfile.statistics.text.totalXp += xpToAdd * multiplier
    guildProfile.statistics.text.dailyXp += xpToAdd * multiplier

    return guildProfile
}

async function addGlobalTextXp(userId: Snowflake, xpToAdd: number) {
    const globalProfile = await Profiles.get(userId) as Profile;
    const { level, xp, cooldown } = globalProfile.statistics.text;
    if(cooldown) return;
    globalProfile.statistics.text.cooldown = true;
    const xpNeeded = Profiles.neededXp(level);

    setTimeout(() => {
        globalProfile.statistics.text.cooldown = false;
    }, 60000);

    if(xp + xpToAdd >= xpNeeded) return levelUp(globalProfile, null, xp, xpToAdd, xpNeeded, true);

    globalProfile.statistics.text.xp += xpToAdd
    globalProfile.statistics.text.totalXp += xpToAdd
    globalProfile.statistics.text.dailyXp += xpToAdd

    return globalProfile;
}

async function levelUp(profile: GuildMember | Profile, channelId: Snowflake | null, xp: number, xpToAdd: number, xpNeeded: number, isGlobal: boolean = false) {
    const rest = (xp + xpToAdd) - xpNeeded;

    profile.statistics.text.level += 1;
    profile.statistics.text.xp = rest;
    profile.statistics.text.totalXp += xpToAdd;
    profile.statistics.text.dailyXp += xpToAdd;
    

    'coins' in profile && (profile.coins += profile.statistics.text.level * (10 + profile.statistics.text.level * 2))
    'guildId' in profile && channelId && sendLevelUpMessage(profile, channelId);

    return profile;
}

async function sendLevelUpMessage(profile: GuildMember, channelId: Snowflake) {
    const guildConfig = await Guilds.config.get(profile.guildId);
    const messageMode = guildConfig.modules.xp.levelUpMessage.mode
    if(messageMode === 'off') return;
    const guild = await client.guilds.fetch(profile.guildId).catch(() => {})
    if(!guild) return
    const configChannelId = guildConfig.modules.xp.levelUpMessage.channelId
    const channel = messageMode === 'currentChannel' ? await guild.channels.fetch(channelId) as TextChannel : configChannelId && await guild.channels.fetch(configChannelId) as TextChannel;
    if(!channel) return
    const language = guildConfig.language;


    const embed = new MessageEmbed()
        .setColor(palette.primary)
        .setDescription(translate(language, 'xp.levelUpMessage', profile.statistics.text.level, `<@${profile.userId}>`));

    channel.send({ embeds: [embed] });
}

export default new XpSystemModule()