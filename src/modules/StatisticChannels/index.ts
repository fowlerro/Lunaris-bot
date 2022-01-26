import cron from 'node-cron'

import BaseModule from "../../utils/structures/BaseModule";
import { StatisticChannelsModel } from '../../database/schemas/StatisticChannels';
import TextFormatter from '../../utils/Formatters/Formatter';


class StatisticChannelsModule extends BaseModule {
    constructor() {
        super('Statistic Channels', true)
    }

    async run() {
        console.log(this.getName())
        cron.schedule('*/1 * * * *', refresh)
    }
}

async function refresh() {
    const configs = await StatisticChannelsModel.find().catch(e => {console.log(e)})
    if(!configs) return
    configs.forEach(async config => {
        const guild = await client.guilds.fetch(config.guildId).catch((e) => {console.log(e)})
        if(!guild) return
        config.channels.forEach(async statisticChannel => {
            const channel = await guild.channels.fetch(statisticChannel.channelId).catch((e) => {console.log(e)})
            if(!channel) return
            const format = TextFormatter(statisticChannel.format, { guild }, false)
            channel.setName(format)
        })
    })
}

export default new StatisticChannelsModule()