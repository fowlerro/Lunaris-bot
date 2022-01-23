import { GuildMember, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";
import { AutoRoleModel } from "../../database/schemas/AutoRole";
import { AutoRoleTimeModel } from "../../database/schemas/AutoRoleTime";

import { AutoRole } from "types";

class AutoRoleModule extends BaseModule {
    constructor() {
      super('AutoRole', true);
    }

    async run() {
      console.log(this.getName())
      await checkAutoRoles()
    }

    async give(member: GuildMember) {
        const config = await this.get(member.guild.id)
        if(!config) return
        for(const role of config.roles) {
            await member.roles.add(role.roleId).catch(err => console.log(err));
            if(!role.time) return;

            const memberAutoRole = await AutoRoleTimeModel.findOne({ guildId: member.guild.id, userId: member.id }).catch(() => {});
            if(memberAutoRole) {
                if(memberAutoRole.roles.find(e => e.roleId === role.roleId)) return;
                await memberAutoRole.updateOne({
                    $push: { roles: { roleId: role.roleId, time: Date.now() + role.time } },
                }).catch(err => console.log(err));
            } else {
                await AutoRoleTimeModel.create({
                    guildId: member.guild.id,
                    userId: member.id,
                    roles: [{ roleId: role.roleId, time: Date.now() + role.time }],
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

    async get(guildId: Snowflake) {
        const json = await redis.autoRoles.getEx(guildId, { EX: 60 * 10 })
        if(json) return JSON.parse(json) as AutoRole
        
        const configDocument = await AutoRoleModel.findOne({ guildId }, '-_id -__v').catch((e) => { console.log(e) })
        if(!configDocument) return this.create(guildId)

        await redis.autoRoles.setEx(guildId, 60 * 10, JSON.stringify(configDocument.toObject()))

        return configDocument.toObject() as AutoRole
    }

    async set(autoRole: AutoRole) {
        const document = await AutoRoleModel.findOneAndUpdate({ guildId: autoRole.guildId }, autoRole, { new: true, upsert: true, runValidators: true }).catch((e) => { console.log(e) })
        if(!document) return
        const config = document.toObject()
        delete config._id
        delete config.__v
        const res = await redis.autoRoles.setEx(autoRole.guildId, 60 * 10, JSON.stringify(config))
        return res
    }

    async create(guildId: Snowflake): Promise<AutoRole | undefined> {
        const document = await AutoRoleModel.create({ guildId }).catch((e) => { console.log(e) })
        if(!document) return

        const config = document.toObject()
        delete config._id
        delete config.__v
        await redis.autoRoles.setEx(guildId, 60 * 10, JSON.stringify(config))
        return config as AutoRole
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
            if(role.time < Date.now()) {
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
                }, role.time - Date.now())
            }
        }
    }
}

export default new AutoRoleModule()