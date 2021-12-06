import { Snowflake } from "discord-api-types";

import Guilds from "../Guilds";
import { GuildMemberModel } from "../../database/schemas/GuildMembers";
import { generateId } from "../../database/utils";
import { translate } from "../../utils/languages/languages";

export const Warn = {
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