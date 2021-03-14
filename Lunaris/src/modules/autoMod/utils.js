const GuildMembers = require("../../database/schemas/GuildMembers");
const {generateId} = require('../../database/utils');
const { warnAddLog, warnRemoveLog } = require("../guildLogs");
const { translate } = require("../../utils/languages/languages");

const Warn = {
    add: async (client, guildID, userID, reason, by) => {
        try {
            const id = await generateId();
            await GuildMembers.findOneAndUpdate({guildID, userID}, {
                $push: {
                    warns: {reason, by, id}
                }
            }, {upsert: true});

            warnAddLog(client, guildID, by, userID, reason, id);
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    },
    remove: async (client, guildID, id, by) => {
        try {
            if(id === 'all') {
                const result = await GuildMembers.updateMany({guildID}, {
                    $set: {
                        warns: []
                    } 
                });
                return 'all';
            } else {
                const result = await GuildMembers.findOneAndUpdate({guildID, 'warns.id': id}, {
                    $pull: {
                        warns: {id}
                    }
                });
                const warn = result.warns.filter(w => w.id === id);
                warnRemoveLog(client, guildID, by, warn[0].by, result.userID, warn[0].reason, id);
                return result;
            }
        } catch(err) {
            console.log(err);
            return false;
        }
    },
    list: async (client, guildID, userID) => {
        try {
            const guildConfig = client.guildConfigs.get(guildID);
            const language = guildConfig.get('language');
            let result;
            if(userID) {
                result = await GuildMembers.findOne({guildID, userID});
                if(!result.warns.length) return translate(language, 'general.none');
                return result.warns.map((v, i) => `${i+1}. ${translate(language, 'general.reason')}: ${v.reason ? v.reason : translate(language, 'general.none')} | ${translate(language, 'general.by').toLowerCase()}: <@${v.by}> | id: ` + "`" + v.id + "` | " + new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'short'}).format(v.date));
            } else {
                result = await GuildMembers.find({guildID});
                if(!result.map(v => v.warns.length).reduce((a, b) => a + b, 0)) return translate(language, 'general.none');
                let index = 0;
                return result.map((vv, ii) => {
                    return vv.warns.map((v, i) => {
                        index++;
                        return `${index}. <@${vv.userID}> ${translate(language, 'general.by').toLowerCase()} <@${v.by}> ${translate(language, 'general.reason').toLowerCase()}: ${v.reason ? `| ${v.reason}` : translate(language, 'general.none')} | id: ` + "`" + v.id + "` | " + new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'short'}).format(v.date) + `\n`;
                    }).join('');
                });
            }
        } catch(err) {
            console.log(err);
            return false;
        }
    }
}

const Mute = {
    add: async (client, guildID, userID, reason = null, by, time = null) => {
        try {
            const guild = client.guilds.cache.get(guildID);
            const guildConfig = client.guildConfigs.get(guildID);
            const muteRoleID = guildConfig.get('modules.autoMod.muteRole');
            let timestamp = null;
            const date = Date.now();
            if(time) timestamp = date + time;
            let muteRole = guild.roles.cache.get(muteRoleID) || guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
            if(!muteRole) {
                muteRole = await guild.roles.create({
                    data: {
                        name: 'Muted',
                        permissions: []
                    }
                });
                
                await guild.channels.cache.map(async channel => {
                    await channel.createOverwrite(muteRole, {
                        SEND_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        ADD_REACTIONS: false,
                    });
                });
                
            } 
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
                    await guild.members.cache.get(userID).roles.remove(muteRole).catch(e => console.log(e));
                    await GuildMembers.findOneAndUpdate({guildID, userID}, {
                        muted: {
                            state: false,
                            timestamp: null,
                            date: null,
                            reason: null,
                            by: null,
                        }
                    }, {upsert: true});
                }, time);
            }

            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    },
    remove: async (client, guildID, userID) => {
        try {
            const guild = client.guilds.cache.get(guildID);
            const member = guild.members.cache.get(userID);
            const guildConfig = client.guildConfigs.get(guildID);
            const muteRoleID = guildConfig.get('modules.autoMod.muteRole');
            let muteRole = guild.roles.cache.get(muteRoleID) || guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
            const hasRole = member.roles.cache.has(muteRole.id);
            if(!hasRole) return "notMuted";

            await member.roles.remove(muteRole).catch(e => console.log(e));
            await GuildMembers.findOneAndUpdate({guildID, userID}, {
                muted: {
                    state: false,
                    timestamp: null,
                    date: null,
                    reason: null,
                    by: null,
                }
            }, {upsert: true});
            return true;

        } catch(err) {
            console.log(err);
            return false;
        }
    },
    list: async (client, guildID) => {
        try {
            const guildConfig = client.guildConfigs.get(guildID);
            const language = guildConfig.get('language');
            const collections = await GuildMembers.find({guildID, 'muted.state': true});
            if(!collections.length) return translate(language, 'general.none');
            const list = collections.map((v, i) => `${i+1}. <@${v.userID}> ${translate(language, 'general.by').toLowerCase()} <@${v.muted.by}> | ${translate(language, 'general.reason').toLowerCase()}: ${v.muted.reason ? `${v.muted.reason}` : `${translate(language, 'general.none')}`} | ${new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'short'}).format(v.muted.date)} | ${v.muted.timestamp ? (translate(language, 'general.forTime'), msToTime(v.muted.timestamp - v.muted.date)) : "perm"}`);
            return list
        } catch(err) {
            console.log(err);
            return false
        }
    },
}

module.exports = {Mute, Warn}