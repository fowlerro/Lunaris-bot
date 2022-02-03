import { VoiceState, GuildMember, Collection, Snowflake } from "discord.js";
import { GuildProfile } from "../../database/schemas/GuildProfile";
import { Profile } from "../../database/schemas/Profile";

import Profiles from "../Profiles";

import xpSystem from "./index";
import { voiceLevelUp } from "./levelUp";

const membersInterval: {
    [x: string]: NodeJS.Timer
} = {};

export async function handleVoiceXp(oldState: VoiceState, newState: VoiceState) {
    const newChannelId = newState.channelId;
    const oldChannelId = oldState.channelId;

    if(!newChannelId) return disconnectedVoice(oldState);

    if(!oldChannelId) return joinedVoice(newState);

    if(oldChannelId === newChannelId) return changedState(newState);

    return changedChannel(oldState, newState);
}

async function joinedVoice(newState: VoiceState) {
    const members = newState.channel?.members.filter(member => !member.user.bot);
    if(!members) return
    const verifiedMembers = checkMembers(members);

    if(verifiedMembers.length < 2) return;

    verifiedMembers.forEach(memberId => {
        startXp(newState.guild.id, memberId);
    });
}

async function changedChannel(oldState: VoiceState, newState: VoiceState) {
    if(!newState.member) return
    stopXp(newState.guild.id, newState.member.id);

    checkNewChannel(newState);
    checkOldChannel(oldState);
}

async function changedState(newState: VoiceState) {
    const { id, serverDeaf, serverMute, selfDeaf, selfMute } = newState;
    const members = newState.channel?.members.filter(member => !member.user.bot);
    if(!members) return
    const verifiedMembers = checkMembers(members);
    
    if([serverDeaf, serverMute, selfDeaf, selfMute].some(el => el === true)) {
        stopXp(newState.guild.id, id);

        if(verifiedMembers.length > 1) return;
        verifiedMembers.forEach(memberId => {
            stopXp(newState.guild.id, memberId);
        });
    } else {
        if(verifiedMembers.length < 2) return;
        verifiedMembers.forEach(memberId => {
            startXp(newState.guild.id, memberId)
        });
    }
}

async function disconnectedVoice(oldState: VoiceState) {
    if(!oldState.member) return
    stopXp(oldState.guild.id, oldState.member.id);
    
    const members = oldState.channel?.members.filter(member => !member.user.bot);
    if(!members) return
    const verifiedMembers = checkMembers(members);
    if(verifiedMembers.length > 1) return;

    verifiedMembers.forEach(memberId => {
        stopXp(oldState.guild.id, memberId);
    });
}

function checkNewChannel(state: VoiceState) {
    const members = state.channel?.members.filter(member => !member.user.bot);
    if(!members) return
    const verifiedMembers = checkMembers(members);
    if(verifiedMembers.length < 2) return;

    verifiedMembers.forEach(memberId => {
        startXp(state.guild.id, memberId);
    });
}

function checkOldChannel(state: VoiceState) {
    const members = state.channel?.members.filter(member => !member.user.bot);
    if(!members) return
    const verifiedMembers = checkMembers(members);
    if(verifiedMembers.length > 1) return;

    verifiedMembers.forEach(memberId => {
        stopXp(state.guild.id, memberId);
    });
}

function checkMembers(members: Collection<string, GuildMember>): Snowflake[] {
    const verifiedMembers: Snowflake[] = [];
    members.forEach(member => {
        const { id, serverDeaf, serverMute, selfDeaf, selfMute } = member.voice;
        if([serverDeaf, serverMute, selfDeaf, selfMute].every(el => el === false)) {
            verifiedMembers.push(id);
        }
    });

    return verifiedMembers;
}

async function startXp(guildId: Snowflake, memberId: Snowflake) {
    if(!membersInterval[`${guildId}-${memberId}`]) {
        membersInterval[`${guildId}-${memberId}`] = setInterval(async () => {
            const guildProfile = await Profiles.get(memberId, guildId)
            if(!guildProfile) return
            const globalProfile = await Profiles.get(memberId)
            if(!globalProfile) return

            const levelConfig = await xpSystem.get(guildId);
            if(!levelConfig) return
            const multiplier = levelConfig.multiplier || 1;
            const xpToAdd = Math.floor(Math.random() * (35 - 20) + 20);

            addXp(guildProfile, (xpToAdd * multiplier))
            addXp(globalProfile, xpToAdd)
        }, 60000);
    }
}

function stopXp(guildId: Snowflake, memberId: Snowflake) {
    global.clearInterval(membersInterval[`${guildId}-${memberId}`])
    delete membersInterval[`${guildId}-${memberId}`] //TODO Check if delete works after clearing
}

function addXp(profile: GuildProfile | Profile, xpToAdd: number) {
    const { level, xp } = profile.statistics.voice;
    const xpNeeded = Profiles.neededXp(level);
    if(xp + xpToAdd >= xpNeeded) return voiceLevelUp(profile, xp, xpToAdd, xpNeeded);
    
    profile.statistics.voice.xp += xpToAdd
    profile.statistics.voice.totalXp += xpToAdd
    profile.statistics.voice.dailyXp += xpToAdd
    profile.statistics.voice.timeSpent += 1

    Profiles.set(profile)

    return profile
}