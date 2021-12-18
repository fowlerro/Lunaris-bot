import { Snowflake } from "discord-api-types";

import Guilds from "../Guilds";
import { GuildProfileDocument, GuildProfileModel, GuildProfileWarn } from "../../database/schemas/GuildProfile";
import { translate } from "../../utils/languages/languages";

export const Warn = {
    give: async (guildId: Snowflake, targetId: Snowflake, executorId: Snowflake, reason?: string) => {
        await GuildProfileModel.findOneAndUpdate({ guildId, userId: targetId }, {
            $push: {
                warns: {
                    executorId,
                    reason
                }
            }
        }, { upsert: true });

        // warnAddLog(guildId, by, userId, reason, id); // TODO
        return true;
    },
    remove: async (guildId: Snowflake, warnId: string, executorId: Snowflake, targetId?: Snowflake): Promise<{ action?: 'all' | 'targetAll', error?: 'warnNotFound' | 'targetNotFound', result?: GuildProfileDocument }> => {
        if(warnId === 'all') {
            await GuildProfileModel.updateMany({ guildId }, {
                $set: {
                    warns: []
                } 
            });
            return { action: 'all' };
        }

        if(warnId === 'targetAll' && targetId) {
            const result = await GuildProfileModel.updateOne({ guildId, userId: targetId }, {
                $set: {
                    warns: []
                }
            }).catch(() => {})

            if(!result) return { error: 'targetNotFound' }
            return { action: 'targetAll' }
        }

        const result = await GuildProfileModel.findOneAndUpdate({ guildId, 'warns._id': warnId }, {
            $pull: {
                warns: {
                    _id: warnId
                }
            }
        }).catch(() => {})

        if(!result) return { error: 'warnNotFound' }

        // const warn = result.warns.filter(w => w._id === id);
        // warnRemoveLog(client, guildId, by, warn[0].by, result.userId, warn[0].reason, id); // TODO
        return { result }
    },
    list: async (guildId: Snowflake, targetId?: Snowflake): Promise<{ warns: GuildProfileWarn[] | GuildProfileDocument[], error?: string}> => {
        const { language } = await Guilds.config.get(guildId);
        if(targetId) {
            const result = await GuildProfileModel.findOne({ guildId, userId: targetId });
            if(!result?.warns.length) return { error: translate(language, 'general.none'), warns: [] };
            return { warns: result.warns };
        }

        let warns = await GuildProfileModel.find({ guildId }).select(['-muted', '-_id', '-guildId', '-__v']);
        warns = warns.filter(v => v.warns.length > 0)
        if(!warns.map(v => v.warns.length).reduce((a, b) => a + b, 0)) return { error: translate(language, 'general.none'), warns: [] };
        
        return { warns };
    }
}