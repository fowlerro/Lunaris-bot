import { Message, Snowflake } from "discord.js";

import Profiles from "../Profiles";

import xpSystem from "./index";
import { textLevelUp } from "./levelUp";

const cooldowns = new Map<string, boolean>()

export async function handleTextXp(message: Message) {
        const guildId = message.guild?.id;
        if(!guildId) return
        const channelId = message.channel.id
        const userId = message.author.id;

        const levelConfig = await xpSystem.get(guildId)
        if(!levelConfig) return
        const multiplier = levelConfig.multiplier || 1
        const xpToAdd = Math.floor(Math.random() * (35 - 20) + 20);

        await addGuildTextXp(guildId, channelId, userId, xpToAdd, multiplier);
        await addGlobalTextXp(userId, xpToAdd);
    }

async function addGuildTextXp(guildId: Snowflake, channelId: Snowflake, userId: Snowflake, xpToAdd: number, multiplier: number) {
    const guildProfile = await Profiles.get(userId, guildId)
    if(!guildProfile) return

    const { level, xp } = guildProfile.statistics.text;
    if(cooldowns.get(`${guildId}-${userId}`)) return;
    cooldowns.set(`${guildId}-${userId}`, true)
    const xpNeeded = Profiles.neededXp(level);

    setTimeout(() => {
        cooldowns.set(`${guildId}-${userId}`, false)
    }, 60000);

    if(xp + Math.floor(xpToAdd * multiplier) >= xpNeeded) return textLevelUp(guildProfile, channelId, xp, Math.floor(xpToAdd * multiplier), xpNeeded);

    guildProfile.statistics.text.xp += Math.floor(xpToAdd * multiplier)
    guildProfile.statistics.text.totalXp += Math.floor(xpToAdd * multiplier)
    guildProfile.statistics.text.dailyXp += Math.floor(xpToAdd * multiplier)

    Profiles.set(guildProfile)

    return guildProfile
}

async function addGlobalTextXp(userId: Snowflake, xpToAdd: number) {
    const globalProfile = await Profiles.get(userId)
    if(!globalProfile) return

    const { level, xp } = globalProfile.statistics.text;
    if(cooldowns.get(userId)) return;
    cooldowns.set(userId, true)
    const xpNeeded = Profiles.neededXp(level)

    setTimeout(() => {
        cooldowns.set(userId, false)
    }, 60000);

    if(xp + xpToAdd >= xpNeeded) return textLevelUp(globalProfile, null, xp, xpToAdd, xpNeeded);

    globalProfile.statistics.text.xp += xpToAdd
    globalProfile.statistics.text.totalXp += xpToAdd
    globalProfile.statistics.text.dailyXp += xpToAdd

    Profiles.set(globalProfile)

    return globalProfile;
}