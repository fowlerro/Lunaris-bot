import { Document, model, Schema } from "mongoose";
import { palette } from "../../utils/utils";

import { EmbedMessage } from 'types'

export interface EmbedDocument extends Omit<EmbedMessage, '_id'>, Document {}

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
        hexColor: {
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