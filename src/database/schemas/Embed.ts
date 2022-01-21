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
        minlength: 18,
        maxlength: 18
    },
    channelId: {
        type: String,
        minlength: 18,
        maxlength: 18
    },
    messageId: {
        type: String,
        minlength: 18,
        maxlength: 18
    },
    messageContent: {
        type: String,
        maxlength: 2000
    },
    embed: {
        author: {
            name: {
                type: String,
                maxlength: 256
            },
            url: {
                type: String,
                maxlength: 1000
            },
            iconURL: {
                type: String,
                maxlength: 1000
            } 
        },
        hexColor: {
            type: String,
            default: palette.info
        },
        description: {
            type: String,
            maxlength: 4096
        },
        footer: {
            text: {
                type: String,
                maxlength: 2048
            },
            iconURL: {
                type: String,
                maxlength: 1000
            }
        },
        image: {
            url: {
                type: String,
                maxlength: 1000
            },
            width: Number,
            height: Number
        },
        thumbnail: {
            url: {
                type: String,
                maxlength: 1000
            },
            width: Number,
            height: Number
        },
        timestamp: {
            type: Number
        },
        title: {
            type: String,
            maxlength: 256 
        },
        url: {
            type: String,
            maxlength: 1000   
        },
        fields: [{
            name: {
                type: String,
                maxlength: 256
            },
            value: {
                type: String,
                maxlength: 1024
            },
            inline: {
                type: Boolean,
                default: false
            }
        }]
    },
});

export const EmbedModel = model<EmbedDocument>('Embed', EmbedSchema);