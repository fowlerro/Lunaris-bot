import { Snowflake } from "discord.js";
import { Document, model, Schema } from "mongoose";


interface StatisticChannel {
    channelId: Snowflake
    format: string
}

interface StatisticChannelsConfig {
    guildId: Snowflake
    channels: StatisticChannel[]
}

export interface StatisticChannelsDocument extends StatisticChannelsConfig, Document {}

const StatisticChannelsSchema = new Schema({
    guildId: {
        type: String,
        minlength: 18,
        maxlength: 18,
        required: true,
        unique: true
    },
    channels: [{
        channelId: {
            type: String,
            minlength: 18,
            maxlength: 18,
            required: true,
            unique: true
        },
        format: {
            type: String,
            maxlength: 64
        }
    }]
})

export const StatisticChannelsModel = model<StatisticChannelsDocument>('StatisticChannels', StatisticChannelsSchema)