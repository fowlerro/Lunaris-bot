import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";
import { Language } from "../../utils/languages/types";

interface LevelUpMessage {
    mode: 'off' | 'currentChannel' | 'specificChannel';
    channelId?: Snowflake;
}
interface GuildModuleXp {
    levelUpMessage: LevelUpMessage;
    multiplier: number
}
interface GuildModuleAutoMod {
    muteRole?: Snowflake;
}
interface GuildModules {
    autoMod: GuildModuleAutoMod;
    xp: GuildModuleXp
}
export interface GuildConfigDocument extends Document {
    guildId: Snowflake;
    language: Language;
    modules: GuildModules;
}

const GuildConfigSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true
    },
    language: {
        type: String,
        default: 'en'
    },
    modules: {
        autoMod: {
            muteRole: {
                type: String
            }
        },
        xp: {
            levelUpMessage: {
                mode: {
                    type: String,
                    default: 'currentChannel'
                },
                channelId: {
                    type: String
                }
            },
            multiplier: {
                type: Number,
                default: 1
            }
        }
    }
})

GuildConfigSchema.index({ guildId: 1 })

export const GuildConfigModel = model<GuildConfigDocument>('GuildConfig', GuildConfigSchema)