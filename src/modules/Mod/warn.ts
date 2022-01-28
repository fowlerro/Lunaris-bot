import { Snowflake } from 'discord.js'

import { GuildProfileDocument, GuildProfileModel, GuildProfileWarn } from "../../database/schemas/GuildProfile";
import Logs from '../Logs';
import Profiles from '../Profiles';

export const Warn = {
    give: async (guildId: Snowflake, targetId: Snowflake, executorId: Snowflake, reason?: string) => {
        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return
        const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'
        const target = await guild.members.fetch(targetId).catch(() => {})
        if(!target) return
        const document = await GuildProfileModel.findOneAndUpdate({ guildId, userId: targetId }, {
            $push: {
                warns: {
                    executorId,
                    reason
                }
            }
        }, { upsert: true, new: true, runValidators: true }).catch(() => {})
        if(!document) return
        await Profiles.set(document)
        await Logs.log('members', 'warn', guildId, { member: target, customs: { moderatorMention: `<@${executorId}>`, moderatorId: executorId, memberWarnCount: document.warns.length, reason: reason || t('general.none', language) } })

        return true;
    },
    remove: async (guildId: Snowflake, warnId: string, executorId: Snowflake, targetId?: Snowflake, reason?: string): Promise<{ action?: 'all' | 'targetAll', error?: 'warnNotFound' | 'targetNotFound' | 'guildNotFound', result?: GuildProfileDocument }> => {
        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return { error: 'guildNotFound' }
        const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'
        if(warnId === 'all') { 
            await GuildProfileModel.updateMany({ guildId }, {
                $set: {
                    warns: []
                } 
            });
            const guildProfileList = await redis.guildProfiles.scan(0, { MATCH: `${guildId}-*` })
            for await (const key of guildProfileList.keys) {
                console.log(key)
                await redis.guildProfiles.del(key)
            }
            return { action: 'all' };
        }

        if(warnId === 'targetAll' && targetId) {
            const result = await GuildProfileModel.findOneAndUpdate({ guildId, userId: targetId }, {
                $set: {
                    warns: []
                }
            }, { upsert: true, new: true, runValidators: true }).catch(() => {})
            if(!result) return { error: 'targetNotFound' }
            await Profiles.set(result)
            return { action: 'targetAll' }
        }

        if(!targetId) return { error: 'targetNotFound' }

        const target = await guild.members.fetch(targetId).catch(() => {})
        if(!target) return { error: 'targetNotFound' }

        const document = await GuildProfileModel.findOneAndUpdate({ guildId, 'warns._id': warnId }, {
            $pull: {
                warns: {
                    _id: warnId
                }
            }
        }, { upsert: true, new: true, runValidators: true }).catch(() => {})
        if(!document) return { error: 'warnNotFound' }
        await Profiles.set(document)
        await Logs.log('members', 'unwarn', guildId, { member: target, customs: { moderatorMention: `<@${executorId}>`, moderatorId: executorId, memberWarnCount: document.warns.length || "0", reason: reason || t('general.none', language) }})

        return { result: document }
    },
    list: async (guildId: Snowflake, targetId?: Snowflake): Promise<{ warns: GuildProfileWarn[] | GuildProfileDocument[], error?: string}> => {
        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return { error: 'guildNotFound', warns: [] }
        const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'

        if(targetId) {
            const result = await GuildProfileModel.findOne({ guildId, userId: targetId });
            if(!result?.warns.length) return { error: t('general.none', language), warns: [] };
            return { warns: result.warns };
        }

        let warns = await GuildProfileModel.find({ guildId }).select(['-muted', '-_id', '-guildId', '-__v']);
        warns = warns.filter(v => v.warns.length > 0)
        if(!warns.map(v => v.warns.length).reduce((a, b) => a + b, 0)) return { error: t('general.none', language), warns: [] };
        
        return { warns };
    }
}