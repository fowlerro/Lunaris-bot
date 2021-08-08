const GuildMembers = require("../../database/schemas/GuildMembers");
const {generateId} = require('../../database/utils');
const { warnAddLog, warnRemoveLog, muteLog, unmuteLog } = require("../guildLogs");
const { translate } = require("../../utils/languages/languages");
const { msToTime, setGuildConfig } = require('../../utils/utils');
const { Permissions } = require("discord.js");

const Warn = {
    add: async (client, guildID, userID, reason, by) => {
        if(!guildID) return;
        const id = await generateId();
        await GuildMembers.findOneAndUpdate({guildID, userID}, {
            $push: {
                warns: {reason, by, id}
            }
        }, {upsert: true});

        warnAddLog(client, guildID, by, userID, reason, id);
        return true;
    },
    remove: async (client, guildID, id, by) => {
        if(!guildID) return;
        if(id === 'all') {
            await GuildMembers.updateMany({guildID}, {
                $set: {
                    warns: []
                } 
            });
            return {action: 'all'};
        }

        const result = await GuildMembers.findOneAndUpdate({guildID, 'warns.id': id}, {
            $pull: {
                warns: {id}
            }
        });

        if(!result) return {error: 'warnNotFound'}

        const warn = result.warns.filter(w => w.id === id);
        warnRemoveLog(client, guildID, by, warn[0].by, result.userID, warn[0].reason, id);
        return result;
    },
    list: async (client, guildID, userID) => {
        if(!guildID) return;
        const guildConfig = client.guildConfigs.get(guildID);
        const language = guildConfig.get('language');
        if(userID) {
            const result = await GuildMembers.findOne({guildID, userID});
            if(!result?.warns.length) return {error: translate(language, 'general.none')};
            return {warns: result.warns};
        }

        let warns = await GuildMembers.find({guildID}).select(['-muted', '-_id', '-guildID', '-__v']);
        warns = warns.filter(v => v.warns.length > 0);
        if(!warns.map(v => v.warns.length).reduce((a, b) => a + b, 0)) return {error: translate(language, 'general.none')};
        
        return {warns};
    }
}

// TODO: Remove mute if someone take role from a member
const Mute = {
    add: async (client, guildID, userID, reason = null, by, time = null) => {
            const guild = client.guilds.cache.get(guildID);
            const guildConfig = client.guildConfigs.get(guildID);

            if(!guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return {error: "missingPermission", perms: Permissions.FLAGS.MANAGE_ROLES}

            const muteRoleID = guildConfig.get('modules.autoMod.muteRole');
            let timestamp = null;
            const date = Date.now();
            if(time) timestamp = date + time;
            let muteRole = guild.roles.cache.get(muteRoleID) || guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
            if(!muteRole) muteRole = await createMuteRole(guild);
            if(muteRoleID !== muteRole.id) setGuildConfig(client, guildID, 'modules.autoMod.muteRole', muteRole.id);
            await guild.members.cache.get(userID).roles.add(muteRole).catch(e => console.log(e));
            await GuildMembers.findOneAndUpdate({guildID, userID}, {
                muted: {
                    state: true,
                    timestamp,
                    date,
                    reason,
                    by
                }
            }, {upsert: true});
            if(time) {
                setTimeout(async () => {
                    if(guild.members.cache.get(userID)) await guild.members.cache.get(userID).roles.remove(muteRole).catch(e => console.log(e));
                    const muteInfo = await GuildMembers.findOneAndUpdate({guildID, userID}, {
                        muted: {
                            state: false,
                            timestamp: null,
                            date: null,
                            reason: null,
                            by: null,
                        }
                    }, {upsert: true});

                    unmuteLog(client, guildID, muteInfo.muted.by, 'System', userID);
                }, time);
            }

            const timeString = time ? msToTime(time).toString() : "perm";
            muteLog(client, guildID, by, userID, reason, timeString);
            
            return true;
    },
    remove: async (client, guildID, executor, userID, reason) => {
        const guild = client.guilds.cache.get(guildID);
        const member = guild.members.cache.get(userID);
        const guildConfig = client.guildConfigs.get(guildID);
        const muteRoleID = guildConfig.get('modules.autoMod.muteRole');
        let muteRole = guild.roles.cache.get(muteRoleID) || guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
        const hasRole = member.roles.cache.has(muteRole.id);
        if(!hasRole && reason !== "Role remove") return "notMuted";

        hasRole && await member.roles.remove(muteRole).catch(e => console.log(e));
        const muteInfo = await GuildMembers.findOneAndUpdate({guildID, userID}, {
            muted: {
                state: false,
                timestamp: null,
                date: null,
                reason: null,
                by: null,
            }
        }, {upsert: true});

        unmuteLog(client, guildID, muteInfo.muted.by, executor, userID, reason);

        return true;
    },
    list: async (client, guildID) => {
        const { language } = client.guildConfigs.get(guildID);
        const collections = await GuildMembers.find({guildID, 'muted.state': true}).select(['-warns', '-_id', '-guildID', '-__v']);
        if(!collections.length) return {error: translate(language, 'general.none')};
        return collections
    },
    reassignRole: async (client, guildID, userID) => {
        const guildConfig = client.guildConfigs.get(guildID);
        const muteRoleID = guildConfig.get('modules.autoMod.muteRole');
        const guild = client.guilds.cache.get(guildID);
        const member = guild.members.cache.get(userID);
        const memberInfo = await GuildMembers.findOne({guildID, userID, 'muted.state': true});
        let muteRole = guild.roles.cache.get(muteRoleID) || guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
        if(!memberInfo) return 'notMuted';
        await member.roles.add(muteRole).catch(e => console.log(e));

        return true;
    }
}

async function createMuteRole(guild) {
    const muteRole = await guild.roles.create({
        name: 'Muted',
        permissions: []
    });
    
    await guild.channels.cache.map(async channel => {
        await channel.permissionOverwrites.create(muteRole, {
            SEND_MESSAGES: false,
            MANAGE_MESSAGES: false,
            ADD_REACTIONS: false,
        })
    });

    return muteRole;
}

module.exports = {Mute, Warn}