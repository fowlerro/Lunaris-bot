import { Snowflake } from 'discord.js'

import Logs from '../Logs';
import Profiles from '../Profiles';
import { GuildProfileDocument, GuildProfileModel, GuildProfileWarn } from "../../database/schemas/GuildProfile";
import { getLocale } from '../../utils/utils';

export const Warn = {
    give: async (guildId: Snowflake, targetId: Snowflake, executorId: Snowflake, reason?: string) => {
        const guild = await client.guilds.fetch(guildId).catch(logger.error)
        if(!guild) return
        const language = getLocale(guild.preferredLocale)
        const target = await guild.members.fetch(targetId).catch(logger.error)
        if(!target) return
        const document = await GuildProfileModel.findOneAndUpdate({ guildId, userId: targetId }, {
            $push: {
                warns: {
                    executorId,
                    reason
                }
            }
        }, { upsert: true, new: true, runValidators: true }).catch(logger.error)
        if(!document) return
        await Profiles.set(document)
        await Logs.log('members', 'warn', guildId, { member: target, customs: { moderatorMention: `<@${executorId}>`, moderatorId: executorId, memberWarnCount: document.warns.length, reason: reason || t('general.none', language) } })

        return true;
    },
    remove: async (guildId: Snowflake, warnId: string, executorId: Snowflake, targetId?: Snowflake, reason?: string): Promise<{ action?: 'all' | 'targetAll', error?: 'warnNotFound' | 'targetNotFound' | 'guildNotFound' | 'targetWithoutWarns', result?: GuildProfileDocument }> => {
        const guild = await client.guilds.fetch(guildId).catch(logger.error)
        if(!guild) return { error: 'guildNotFound' }
        const language = getLocale(guild.preferredLocale)
        if(warnId === 'all') { 
            await GuildProfileModel.updateMany({ guildId }, {
                $set: {
                    warns: []
                } 
            }).catch(logger.error)
            const guildProfileList = await redis.guildProfiles.scan(0, { MATCH: `${guildId}-*` })
            for await (const key of guildProfileList.keys) {
                await redis.guildProfiles.del(key)
            }

            Logs.log('server', 'unwarnAll', guildId, { customs: { mentionModerator: `<@${executorId}>`, moderatorId: executorId, reason: reason || t('general.none', language) } })
            return { action: 'all' };
        }

        if(warnId === 'targetAll' && targetId) {
            const target = await guild.members.fetch(targetId).catch(logger.error)
            const profile = await Profiles.get(targetId, guildId) as GuildProfileDocument
            if(!profile.warns.length) return { error: 'targetWithoutWarns' }
            const result = await GuildProfileModel.findOneAndUpdate({ guildId, userId: targetId }, {
                $set: {
                    warns: []
                }
            }, { upsert: true, new: true, runValidators: true }).catch(logger.error)
            if(!result) return { error: 'targetNotFound' }
            await Profiles.set(result)
            await Logs.log('members', 'unwarnAll', guildId, { member: target, customs: { moderatorMention: `<@${executorId}>`, moderatorId: executorId, memberUnwarnCount: profile.warns.length || "0", reason: reason || t('general.none', language) }})

            return { action: 'targetAll' }
        }

        if(!targetId) return { error: 'targetNotFound' }

        const target = await guild.members.fetch(targetId).catch(logger.error)
        if(!target) return { error: 'targetNotFound' }

        const document = await GuildProfileModel.findOneAndUpdate({ guildId, 'warns._id': warnId }, {
            $pull: {
                warns: {
                    _id: warnId
                }
            }
        }, { upsert: true, new: true, runValidators: true }).catch(logger.error)
        if(!document) return { error: 'warnNotFound' }
        await Profiles.set(document)
        await Logs.log('members', 'unwarn', guildId, { member: target, customs: { moderatorMention: `<@${executorId}>`, moderatorId: executorId, memberWarnCount: document.warns.length || "0", reason: reason || t('general.none', language) }})

        return { result: document }
    },
    list: async (guildId: Snowflake, targetId?: Snowflake): Promise<{ warns: GuildProfileWarn[] | GuildProfileDocument[], error?: string}> => {
        if(targetId) {
            const result = await GuildProfileModel.findOne({ guildId, userId: targetId }).catch(logger.error)
            if(!result) return { error: 'profileNotFound', warns: [] }
            if(!result?.warns.length) return { warns: [] }
            return { warns: result.warns }
        }

        let warns = await GuildProfileModel.find({ guildId }).select(['-muted', '-_id', '-guildId', '-__v']).catch(logger.error)
        if(!warns) return { error: 'profileNotFound', warns: [] }
        warns = warns.filter(v => v.warns.length > 0)
        if(!warns.map(v => v.warns.length).reduce((a, b) => a + b, 0)) return { warns: [] };
        
        return { warns };
    }
}