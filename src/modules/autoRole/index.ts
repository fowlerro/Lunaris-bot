import { GuildMember, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";
import { AutoRoleModel } from "../../database/schemas/AutoRole";
import { AutoRoleTimeModel } from "../../database/schemas/AutoRoleTime";
import type { AutoRole } from "types";

class AutoRoleModule extends BaseModule {
    constructor() {
        super('AutoRole', true);
    }

    async run() {
        logger.info(this.getName())
        await checkAutoRoles()
    }

    async give(member: GuildMember) {
        const config = await this.get(member.guild.id)
        if(!config) return
        for(const role of config.roles) {
            await member.roles.add(role.roleId).catch(logger.error)
            if(!role.time) return

            const memberAutoRole = await AutoRoleTimeModel.findOne({ guildId: member.guild.id, userId: member.id }).catch(logger.error)
            if(memberAutoRole) {
                if(memberAutoRole.roles.find(e => e.roleId === role.roleId)) return
                await memberAutoRole.updateOne({
                    $push: { roles: { roleId: role.roleId, time: Date.now() + role.time } },
                }).catch(logger.error)
            } else {
                await AutoRoleTimeModel.create({
                    guildId: member.guild.id,
                    userId: member.id,
                    roles: [{ roleId: role.roleId, time: Date.now() + role.time }],
                }).catch(logger.error)
            }

            setTimeout(async () => {
                member.roles.remove(role.roleId).catch(logger.error)
                const memberAutoRole = await AutoRoleTimeModel.findOneAndUpdate({ guildId: member.guild.id, userId: member.id }, {
                    $pull: {
                        roles: { roleId: role.roleId }
                    }
                }, { new: true, runValidators: true }).catch(logger.error)
                if(memberAutoRole && !memberAutoRole.roles.length) {
                    memberAutoRole.delete()
                }
            }, role.time)
        };
    }

    async get(guildId: Snowflake): Promise<AutoRole | null> {
        const cachedConfig = cache.autoRoles.get<AutoRole>(guildId)
        if(cachedConfig) return cachedConfig
        
        const configDocument = await AutoRoleModel.findOne({ guildId }, '-_id -__v').catch(logger.error)
        if(!configDocument) return this.create(guildId)

        cache.autoRoles.set(guildId, configDocument.toObject())

        return configDocument.toObject() as AutoRole
    }

    async set(autoRole: AutoRole): Promise<AutoRole | null> {
        const document = await AutoRoleModel.findOneAndUpdate({ guildId: autoRole.guildId }, autoRole, { new: true, upsert: true, runValidators: true }).catch(logger.error)
        if(!document) return null

        const config = document.toObject()
        delete config._id
        delete config.__v
        
        cache.autoRoles.set(autoRole.guildId, config)
        return config
    }

    async create(guildId: Snowflake): Promise<AutoRole | null> {
        const document = await AutoRoleModel.create({ guildId }).catch(logger.error)
        if(!document) return null

        const config = document.toObject()
        delete config._id
        delete config.__v

        cache.autoRoles.set(guildId, config)
        return config as AutoRole
    }
}

async function checkAutoRoles() {
    const collections = await AutoRoleTimeModel.find()
    for (const collection of collections) {
        const guild = await client.guilds.fetch(collection.guildId).catch(logger.error)
        if(!guild) continue
        const member = await guild.members.fetch(collection.userId).catch(logger.error)
        if(!member) continue
        for (const role of collection.roles) {
            if(role.time < Date.now()) {
                member.roles.remove(role.roleId).catch(logger.error)
                const coll = await AutoRoleTimeModel.findOneAndUpdate({ guildId: collection.guildId, userId: collection.userId }, {
                    $pull: {
                        roles: { roleId: role.roleId }
                    }
                }, { new: true, runValidators: true }).catch(logger.error)
                if(coll && !coll.roles.length) {
                    coll.delete().catch(logger.error)
                }
            } else {
                setTimeout(async () => {
                    member.roles.remove(role.roleId).catch(logger.error)
                    const coll = await AutoRoleTimeModel.findOneAndUpdate({ guildId: collection.guildId, userId: collection.userId }, {
                        $pull: {
                            roles: { roleId: role.roleId }
                        }
                    }, { new: true, runValidators: true }).catch(logger.error)
                    if(coll && !coll.roles.length) {
                        coll.delete().catch(logger.error)
                    }
                }, role.time - Date.now())
            }
        }
    }
}

export default new AutoRoleModule()