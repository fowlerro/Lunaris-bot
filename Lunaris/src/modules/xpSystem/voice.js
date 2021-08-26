const Guilds = require("../Guilds");
const Profiles = require("../Profiles");

const membersInterval = [];

async function handleVoiceXp(client, oldState, newState) {
    const newChannelId = newState.channelId;
    const oldChannelId = oldState.channelId;

    if(!newChannelId) return disconnectedVoice(client, oldState);

    if(!oldChannelId) return joinedVoice(client, newState);

    if(oldChannelId === newChannelId) return changedState(client, newState);

    return changedChannel(client, oldState, newState);
}

async function joinedVoice(client, newState) {
    console.log('joined');
    const members = newState.channel.members.filter(member => !member.user.bot);
    const verifiedMembers = checkMembers(members);

    if(verifiedMembers.length < 2) return;

    verifiedMembers.forEach(memberId => {
        startXp(client, newState.guild.id, memberId);
    });
}

async function changedChannel(client, oldState, newState) {
    console.log('changed channel');
    stopXp(newState.guild.id, newState.member.id);

    checkNewChannel(client, newState);
    checkOldChannel(oldState);
}

async function changedState(client, newState) {
    console.log('changed state');
    const { id, serverDeaf, serverMute, selfDeaf, selfMute } = newState;
    const members = newState.channel.members.filter(member => !member.user.bot);
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
            startXp(client, newState.guild.id, memberId)
        });
    }
}

async function disconnectedVoice(client, oldState) {
    console.log('disconnected');
    stopXp(oldState.guild.id, oldState.member.id);
    
    const members = oldState.channel.members.filter(member => !member.user.bot);
    const verifiedMembers = checkMembers(members);
    if(verifiedMembers.length > 1) return;

    verifiedMembers.forEach(memberId => {
        stopXp(oldState.guild.id, memberId);
    });
}

function checkNewChannel(client, state) {
    const members = state.channel.members.filter(member => !member.user.bot);
    const verifiedMembers = checkMembers(members);
    if(verifiedMembers.length < 2) return;

    verifiedMembers.forEach(memberId => {
        startXp(client, state.guild.id, memberId);
    });
}

function checkOldChannel(state) {
    const members = state.channel.members.filter(member => !member.user.bot);
    const verifiedMembers = checkMembers(members);
    if(verifiedMembers.length > 1) return;

    verifiedMembers.forEach(memberId => {
        stopXp(state.guild.id, memberId);
    });
}

function checkMembers(members) {
    const verifiedMembers = [];
    members.forEach(member => {
        const { id, serverDeaf, serverMute, selfDeaf, selfMute } = member.voice;
        if([serverDeaf, serverMute, selfDeaf, selfMute].every(el => el === false)) {
            verifiedMembers.push(id);
        }
    });

    return verifiedMembers;
}

async function startXp(client, guildId, memberId) {
    if(!membersInterval[`${guildId}-${memberId}`]) {
        membersInterval[`${guildId}-${memberId}`] = setInterval(async () => {
            console.log('xp', memberId);
            const guildProfile = await Profiles.get(client, memberId, guildId);
            const globalProfile = await Profiles.get(client, memberId);
            const guildConfig = await Guilds.config.get(client, guildId);
            const multiplier = guildConfig.get('modules.xp.multiplier');
            const xpToAdd = Math.floor(Math.random() * (35 - 20) + 20);

            addGuildXp(client, guildProfile, (xpToAdd * multiplier));
            addGlobalXp(client, globalProfile, xpToAdd);
        }, 10000);
    }
}

function stopXp(guildId, memberId) {
    clearInterval(membersInterval[`${guildId}-${memberId}`])
    membersInterval[`${guildId}-${memberId}`] = null
}

function addGuildXp(client, profile, xpToAdd) {
    const { level, xp } = profile.statistics.voice;
    const xpNeeded = Profiles.neededXp(level);
    if(xp + xpToAdd >= xpNeeded) return levelUp(client, profile, xp, xpToAdd, xpNeeded);

    profile.statistics.voice.xp += xpToAdd
    profile.statistics.voice.totalXp += xpToAdd
    profile.statistics.voice.dailyXp += xpToAdd
    profile.statistics.voice.timeSpent += 1
}

function addGlobalXp(client, profile, xpToAdd) {
    const { level, xp } = profile.statistics.voice;
    const xpNeeded = Profiles.neededXp(level);
    if(xp + xpToAdd >= xpNeeded) return levelUp(client, profile, xp, xpToAdd, xpNeeded, true);

    profile.statistics.voice.xp += xpToAdd
    profile.statistics.voice.totalXp += xpToAdd
    profile.statistics.voice.dailyXp += xpToAdd
    profile.statistics.voice.timeSpent += 1
}

function levelUp(client, profile, xp, xpToAdd, xpNeeded, isGlobal) {
    const rest = (xp + xpToAdd) - xpNeeded;

    profile.statistics.voice.level += 1;
    profile.statistics.voice.xp = rest;
    profile.statistics.voice.totalXp += xpToAdd;
    profile.statistics.voice.dailyXp += xpToAdd;
    profile.statistics.voice.timeSpent += 1;

    isGlobal && (profile.coins += profile.statistics.voice.level * (10 + profile.statistics.voice.level * 2))
}

module.exports = { handleVoiceXp }