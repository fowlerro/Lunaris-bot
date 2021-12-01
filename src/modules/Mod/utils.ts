// const GuildMembers = require("../../database/schemas/GuildMembers");
// const {generateId} = require('../../database/utils');
// const { warnAddLog, warnRemoveLog, muteLog, unmuteLog } = require("../guildLogs");
// const { translate } = require("../../utils/languages/languages");
// const { msToTime } = require('../../utils/utils');
// const { Permissions } = require("discord.js");
// const Guilds = require("../Guilds");

import { Snowflake } from "discord-api-types";
import { Guild, Permissions } from "discord.js";
import { GuildMemberModel } from "../../database/schemas/GuildMembers";
import { generateId } from "../../database/utils";
import { translate } from "../../utils/languages/languages";
import Guilds from "../Guilds";

const Warn = {
    add: async (guildId: Snowflake, userId: Snowflake, reason?: string, by?: Snowflake) => {
        if(!guildId) return;
        const id = await generateId();
        await GuildMemberModel.findOneAndUpdate({guildId, userId}, {
            $push: {
                warns: {reason, by, id}
            }
        }, { upsert: true });

        // warnAddLog(guildId, by, userId, reason, id); // TODO
        return true;
    },
    remove: async (guildId: Snowflake, id: string, by: Snowflake) => {
        if(!guildId) return;
        if(id === 'all') {
            await GuildMemberModel.updateMany({ guildId }, {
                $set: {
                    warns: []
                } 
            });
            return { action: 'all' };
        }

        const result = await GuildMemberModel.findOneAndUpdate({ guildId, 'warns.id': id }, {
            $pull: {
                warns: { id }
            }
        });

        if(!result) return { error: 'warnNotFound' }

        const warn = result.warns.filter(w => w.id === id);
        // warnRemoveLog(client, guildId, by, warn[0].by, result.userId, warn[0].reason, id); // TODO
        return result;
    },
    list: async (guildId: Snowflake, userId: Snowflake) => {
        if(!guildId) return;
        const guildConfig = await Guilds.config.get(guildId);
        if(!guildConfig) return
        const language = guildConfig.language
        if(userId) {
            const result = await GuildMemberModel.findOne({ guildId, userId });
            if(!result?.warns.length) return { error: translate(language, 'general.none') };
            return { warns: result.warns };
        }

        let warns = await GuildMemberModel.find({ guildId }).select(['-muted', '-_id', '-guildId', '-__v']);
        warns = warns.filter(v => v.warns.length > 0);
        if(!warns.map(v => v.warns.length).reduce((a, b) => a + b, 0)) return { error: translate(language, 'general.none') };
        
        return { warns };
    }
}

// TODO: Remove mute if someone take role from a member
const Mute = {
    add: async (guildId: Snowflake, userId: Snowflake, reason?: string, by?: Snowflake, time?: number) => {
            const guild = await client.guilds.fetch(guildId).catch(() => {})
            if(!guild) return
            const guildConfig = await Guilds.config.get(guildId);
            if(!guildConfig) return

            if(!guild.me?.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.MANAGE_ROLES]).toArray() }

            const muteRoleId = guildConfig.modules?.autoMod?.muteRole
            let timestamp = 0;
            const date = Date.now();
            if(time) timestamp = date + time;
            let muteRole = muteRoleId ? await guild.roles.fetch(muteRoleId) : guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
            if(!muteRole) muteRole = await createMuteRole(guild);
            if(muteRoleId !== muteRole.id) Guilds.config.set(guildId, 'modules.autoMod.muteRole', muteRole.id);
            await guild.members.cache.get(userId).roles.add(muteRole).catch(e => console.log(e));
            await GuildMembers.findOneAndUpdate({guildId, userId}, {
                muted: {
                    isMuted: true,
                    timestamp,
                    date,
                    reason,
                    by
                }
            }, {upsert: true});
            if(time) {
                setTimeout(async () => {
                    if(guild.members.cache.get(userId)) await guild.members.cache.get(userId).roles.remove(muteRole).catch(e => console.log(e));
                    const muteInfo = await GuildMembers.findOneAndUpdate({guildId, userId}, {
                        muted: {
                            isMuted: false,
                            timestamp: null,
                            date: null,
                            reason: null,
                            by: null,
                        }
                    }, {upsert: true});

                    unmuteLog(client, guildId, muteInfo.muted.by, 'System', userId);
                }, time);
            }

            const timeString = time ? msToTime(time).toString() : "perm";
            muteLog(client, guildId, by, userId, reason, timeString);
            
            return true;
    },
    remove: async (client, guildId, executor, userId, reason) => {
        const guild = await client.guilds.fetch(guildId).catch(e => {})

        if(!guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return { error: "missingPermission", perms: new Permissions([Permissions.FLAGS.MANAGE_ROLES]).toArray() }

        const member = guild.members.fetch(userId).catch(e => {})
        const guildConfig = await Guilds.config.get(client, guildId);
        const muteRoleId = guildConfig.get('modules.autoMod.muteRole');
        const muteRole = guild.roles.cache.get(muteRoleId) || guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
        const hasRole = member.roles.cache.has(muteRole.id);
        if(!hasRole && reason !== "Role remove") return "notMuted";

        hasRole && await member.roles.remove(muteRole).catch(e => console.log(e));
        const muteInfo = await GuildMembers.findOneAndUpdate({guildId, userId}, {
            muted: {
                isMuted: false,
                timestamp: null,
                date: null,
                reason: null,
                by: null,
            }
        }, {upsert: true});

        unmuteLog(client, guildId, muteInfo.muted.by, executor, userId, reason);

        return true;
    },
    removeAll: async (client, guildId) => {
        const guild = client.guilds.cache.get(guildId);
        const guildConfig = await Guilds.config.get(client, guildId);
        const language = guildConfig.get('language');

        if(!guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return { error: 'missingPermission', perms: Permissions.FLAGS.MANAGE_ROLES }

        const muteRoleId = guildConfig.get('modules.autoMod.muteRole');
        let muteRole;
        if(!muteRoleId) {
            const guildRoles = await guild.roles.fetch();
            muteRole = guildRoles.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
        } else muteRole = await guild.roles.fetch(muteRoleId);

        // TODO: Fetch SOMEHOW all members with specific role
        console.log('muteRole', muteRole.members.fetch());
        console.log('users', client.users);

        // await muteRole.members.forEach(async member => { 
        //     console.log('unmute', member.id);
        //     member.roles.remove(muteRole, translate(language, 'autoMod.mute.removeAllMutesReason'));
        // })


        // const guildMutes = await GuildMembers.find({ guildId, 'muted.isMuted': true });
        // if(!guildMutes.length) return { error: 'noMutes' };

        const guildMutes = await GuildMembers.updateMany({ guildId, 'muted.isMuted': true}, {
            muted: {
                isMuted: false,
                timestamp: null,
                date: null,
                reason: null,
                by: null,
            }
        });

        return { results: guildMutes }
    },
    list: async (client, guildId) => {
        const { language } = await Guilds.config.get(client, guildId);
        const collections = await GuildMembers.find({guildId, 'muted.isMuted': true}).select(['-warns', '-_id', '-guildId', '-__v']);
        if(!collections.length) return { error: translate(language, 'general.none') };
        return collections;
    },
    reassignRole: async (client, guildId, userId) => {
        const guildConfig = await Guilds.config.get(client, guildId);
        const muteRoleId = guildConfig.get('modules.autoMod.muteRole');
        const guild = client.guilds.cache.get(guildId);
        const member = guild.members.cache.get(userId);
        const memberInfo = await GuildMembers.findOne({guildId, userId, 'muted.isMuted': true});
        let muteRole = guild.roles.cache.get(muteRoleId) || guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
        if(!memberInfo) return 'notMuted';
        await member.roles.add(muteRole).catch(e => console.log(e));

        return true;
    }
}

async function createMuteRole(guild: Guild) {
    const muteRole = await guild.roles.create({
        name: 'Muted',
        permissions: []
    });
    await (await guild.channels.fetch()).map(async channel => {
        await channel.permissionOverwrites.create(muteRole, {
            SEND_MESSAGES: false,
            MANAGE_MESSAGES: false,
            ADD_REACTIONS: false,
        })
    });

    return muteRole;
}

// module.exports = {Mute, Warn}