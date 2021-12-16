import { MessageEmbed, Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";
import { palette } from "../../utils/utils";

interface Embed extends MessageEmbed {
    displayTimestamp: boolean;
}
export interface EmbedDocument extends Document {
    name?: string;
    guildId: Snowflake;
    channelId?: Snowflake;
    messageId?: Snowflake;
    messageContent?: string;
    embed: Embed
}

const EmbedSchema = new Schema({
    name: {
        type: String,
    },
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String
    },
    messageId: {
        type: String
    },
    messageContent: {
        type: String,
    },
    embed: {
        author: {
            name: String,
            url: String,
            iconURL: String
        },
        color: {
            type: String,
            default: palette.info
        },
        description: String,
        footer: {
            text: String,
            iconURL: String
        },
        image: {
            url: String,
            width: Number,
            height: Number
        },
        thumbnail: {
            url: String,
            width: Number,
            height: Number
        },
        timestamp: {
            type: Number
        },
        displayTimestamp: {
            type: Boolean,
            default: true
        },
        title: String,
        url: String,
        fields: [{
            name: String,
            value: String,
            inline: {
                type: Boolean,
                default: false
            }
        }]
    },
});

export const EmbedModel = model<EmbedDocument>('Embed', EmbedSchema);