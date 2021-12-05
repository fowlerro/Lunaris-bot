import BaseModule from "../../utils/structures/BaseModule"
import { GuildMember, GuildMemberModel } from "../../database/schemas/GuildMembers"
import Guilds from "../Guilds"

import { Ban, registerBans } from "./ban"
import { Mute } from "./mute"
import { Warn } from "./warn"

// const { unmuteLog } = require("../guildLogs")

class ModModule extends BaseModule {
    constructor() {
        super('Mod', true)
    }

    async run() {
        console.log(this.getName())
        await registerMutes()
        await registerBans()
    }

    warn = Warn
    mute = Mute
    ban = Ban
}

async function registerMutes() {
    const mutedMembers = await GuildMemberModel.find({ 'mute.isMuted': true, 'mute.timestamp': { $ne: null } });
    for(const mutedMember of mutedMembers) {
        const guild = await client.guilds.fetch(mutedMember.guildId).catch(() => {})
        if(!guild) continue
        const member = await guild.members.fetch(mutedMember.userId)
        if(!member) continue

        const muteRole = await Mute.getRole(guild)
        const hasRole = member.roles.cache.has(muteRole.id);
        if((mutedMember.mute.timestamp && mutedMember.mute.timestamp < Date.now()) || !hasRole) {
            await member.roles.remove(muteRole).catch(err => console.log(err));

            mutedMember.mute = {
                isMuted: false,
                timestamp: null,
                date: null,
                reason: null,
                by: null
            }
            const muteInfo = await mutedMember.save();
            // return unmuteLog(client, guild.id, muteInfo.mute.by, 'System', member.id); // TODO
            return
        }
        if(mutedMember.mute.timestamp) {
            setTimeout(async () => {
                await member.roles.remove(muteRole).catch(e => console.log(e));
                mutedMember.mute = {
                    isMuted: false,
                    timestamp: null,
                    date: null,
                    reason: null,
                    by: null
                }
                const muteInfo = await mutedMember.save();
                // unmuteLog(client, guild.id, muteInfo.muted.by, 'System', member.id); // TODO
      
            }, mutedMember.mute.timestamp - Date.now())
        }
    }
}

export default new ModModule()