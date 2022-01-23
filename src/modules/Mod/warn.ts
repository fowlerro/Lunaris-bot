import { Snowflake } from 'discord.js'

import { GuildProfileDocument, GuildProfileModel, GuildProfileWarn } from "../../database/schemas/GuildProfile";
import Profiles from '../Profiles';

export const Warn = {
    give: async (guildId: Snowflake, targetId: Snowflake, executorId: Snowflake, reason?: string) => {
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

        return true;
    },
    remove: async (guildId: Snowflake, warnId: string, executorId: Snowflake, targetId?: Snowflake): Promise<{ action?: 'all' | 'targetAll', error?: 'warnNotFound' | 'targetNotFound', result?: GuildProfileDocument }> => {
        if(warnId === 'all') {
            await GuildProfileModel.updateMany({ guildId }, {
                $set: {
                    warns: []
                } 
            });
            const guildProfileList = await redis.guildProfiles.scan(0, { MATCH: `${guildId}-*` })
            console.log(guildProfileList)
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

        const result = await GuildProfileModel.findOneAndUpdate({ guildId, 'warns._id': warnId }, {
            $pull: {
                warns: {
                    _id: warnId
                }
            }
        }, { upsert: true, new: true, runValidators: true }).catch(() => {})
        if(!result) return { error: 'warnNotFound' }
        await Profiles.set(result)

        return { result }
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