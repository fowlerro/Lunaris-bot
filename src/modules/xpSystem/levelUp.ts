import { MessageEmbed, Snowflake, TextChannel } from "discord.js";

import { GuildProfileDocument } from "../../database/schemas/GuildProfile";
import { ProfileDocument } from "../../database/schemas/Profile";
import { palette } from "../../utils/utils";
import Profiles from "../Profiles";
import xpSystem from "./index";

export async function levelUp(profile: GuildProfileDocument | ProfileDocument, channelId: Snowflake | null, xp: number, xpToAdd: number, xpNeeded: number, isGlobal: boolean = false) {
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

export async function sendLevelUpMessage(profile: GuildProfileDocument, channelId: Snowflake) {
    const levelConfig = await xpSystem.get(profile.guildId)
    if(!levelConfig) return
    const messageMode = levelConfig.levelUpMessage.mode
    if(messageMode === 'off') return;
    const guild = await client.guilds.fetch(profile.guildId).catch(() => {})
    if(!guild) return
    const configChannelId = levelConfig.levelUpMessage.channelId
    const channel = messageMode === 'currentChannel' ? await guild.channels.fetch(channelId) as TextChannel : configChannelId && await guild.channels.fetch(configChannelId) as TextChannel;
    if(!channel) return
    const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'


    const embed = new MessageEmbed()
        .setColor(palette.primary)
        .setDescription(t('xp.levelUpMessage', language, { level: profile.statistics.text.level.toString(), user: `<@${profile.userId}>` }));

    channel.send({ embeds: [embed] });
}