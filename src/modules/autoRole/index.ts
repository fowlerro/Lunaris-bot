import { GuildMember } from "discord.js";
import ms from 'ms'

import BaseModule from "../../utils/structures/BaseModule";
import { AutoRoleModel } from "../../database/schemas/AutoRole";
import { AutoRoleTimeModel } from "../../database/schemas/AutoRoleTime";

class AutoRoleModule extends BaseModule {
    constructor() {
      super('AutoRole', true);
    }

    async run() {
      console.log(this.getName())
      await checkAutoRoles()
    }

    async give(member: GuildMember) {
        const config = await AutoRoleModel.findOne({ guildId: member.guild.id });
        if(!config) return
        for(const role of config.roles) {
            await member.roles.add(role.roleId).catch(err => console.log(err));
            if(!role.time) return;

            const memberAutoRole = await AutoRoleTimeModel.findOne({ guildId: member.guild.id, userId: member.id }).catch(() => {});
            if(memberAutoRole) {
                if(memberAutoRole.roles.find(e => e.roleId === role.roleId)) return;
                await memberAutoRole.updateOne({
                    $push: { roles: { roleId: role.roleId, timestamp: Date.now() + ms(role.time) } },
                }).catch(err => console.log(err));
            } else {
                await AutoRoleTimeModel.create({
                    guildId: member.guild.id,
                    userId: member.id,
                    roles: [{ roleId: role.roleId, timestamp: Date.now() + ms(role.time) }],
                }).catch(err => console.log(err));
            }

            setTimeout(async () => {
                member.roles.remove(role.roleId).catch(err => console.log(err));
                const memberAutoRole = await AutoRoleTimeModel.findOneAndUpdate({ guildId: member.guild.id, userId: member.id }, {
                    $pull: {
                        roles: { roleId: role.roleId }
                    }
                }, { new: true });
                if(memberAutoRole && !memberAutoRole.roles.length) {
                    memberAutoRole.delete();
                }

            }, role.time)
        };
    }
}

async function checkAutoRoles() {
    const collections = await AutoRoleTimeModel.find();
    for (const collection of collections) {
        const guild = await client.guilds.fetch(collection.guildId).catch(() => {})
        if(!guild) continue
        const member = await guild.members.fetch(collection.userId).catch(() => {})
        if(!member) continue
        for (const role of collection.roles) {
            if(role.timestamp < Date.now()) {
                member.roles.remove(role.roleId).catch(() => {});
                const coll = await AutoRoleTimeModel.findOneAndUpdate({ guildId: collection.guildId, userId: collection.userId }, {
                    $pull: {
                        roles: { roleId: role.roleId }
                    }
                }, { new: true }).catch(() => {});
                if(coll && !coll.roles.length) {
                    coll.delete().catch(() => {});
                }
            } else {
                setTimeout(async () => {
                    member.roles.remove(role.roleId).catch(() => {});
                    const coll = await AutoRoleTimeModel.findOneAndUpdate({ guildId: collection.guildId, userId: collection.userId }, {
                        $pull: {
                            roles: { roleId: role.roleId }
                        }
                    }, { new: true }).catch(() => {});
                    if(coll && !coll.roles.length) {
                        coll.delete().catch(() => {});
                    }
                }, role.timestamp - Date.now())
            }
        }
    }
}

export default new AutoRoleModule()