import { CommandInteraction, Formatters, MessageEmbed, Snowflake } from "discord.js";

import BaseCommand from "../../../utils/structures/BaseCommand";
import Profiles from "../../../modules/Profiles";
import { GuildProfileDocument, GuildProfileModel } from "../../../database/schemas/GuildProfile";
import { ProfileDocument, ProfileModel } from "../../../database/schemas/Profile";
import { getLocale, palette } from "../../../utils/utils";
import { handleCommandError } from '../../errors'

type SortType = 'xp' | 'level' | 'coins';

type SortedProfiles = {
    text?: ProfileDocument[] | GuildProfileDocument[],
    voice?: ProfileDocument[] | GuildProfileDocument[],
    coins?: ProfileDocument[],
}

export default class RankingCommand extends BaseCommand {
    constructor() {
        super(
            'ranking',
            'CHAT_INPUT',
            {
                en: "Displays ranking",
                pl: 'Wyświetla ranking'
            },
            [
                {
                    name: 'global',
                    description: "Displays global ranking",
                    type: 'BOOLEAN',
                },
                {
                    name: 'sortby',
                    description: "A data by which ranking should be displayed",
                    type: 'STRING',
                    choices: [
                        {
                            name: "XP",
                            value: "xp"
                        },
                        {
                            name: "Level",
                            value: "level"
                        },
                        {
                            name: "Coins",
                            value: "coins"
                        },
                    ]
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId) return
        await interaction.deferReply()
        
        const language = getLocale(interaction.guildLocale)

        const sortType = interaction.options.getString('sortby') as SortType || 'xp'
        const isGlobal = interaction.options.getBoolean('global') || false

        const executorProfile = isGlobal || sortType === 'coins' ? await Profiles.get(interaction.user.id) as ProfileDocument : await Profiles.get(interaction.user.id, interaction.guildId) as GuildProfileDocument
        const result = await fetchData(sortType, isGlobal, interaction.guildId)
        if(!result) return handleCommandError(interaction, 'general.error')
        const formattedData = await formatList(sortType, isGlobal, executorProfile, result)

        const embed = new MessageEmbed()
            .setColor(palette.primary)
            .setFooter({ text: t('command.ranking.lastUpdate', language) })
            .setTimestamp(Profiles.lastSave);

        sortType === 'coins' ? embed.addField(t('command.ranking.coins', language), formattedData.coins.join('\n'), true) :
            embed.addField(t('command.ranking.text', language), formattedData.text.join('\n'), true)
                .addField(t('command.ranking.voice', language), formattedData.voice.join('\n'), true)

        interaction.editReply({
            embeds: [embed]
        }).catch(console.error)
    }
}

async function fetchData(sortType: string, isGlobal: boolean, guildId: Snowflake): Promise<SortedProfiles | null> {
    if(sortType === 'coins') {
        const results = isGlobal ? await ProfileModel.find() :
            await GuildProfileModel.aggregate([
                { $match: { guildId } },
                { $lookup: { from: 'profiles', localField: 'userId', foreignField: 'userId', as: 'id' } },
                { $unwind: '$id' },
                { $replaceRoot: { newRoot: '$id' } }
            ]).catch(console.error) as ProfileDocument[] | void
        if(!results) return null

        return { coins: results.sort((a, b) => b.coins - a.coins) }
    }

    const results = isGlobal ? await ProfileModel.find().catch(console.error) as ProfileDocument[] | void : await GuildProfileModel.find({ guildId }).catch(console.error) as GuildProfileDocument[] | void
    if(!results) return null
    const sortBy = sortType === 'xp' ? 'totalXp' : 'level'

    return {
        text: Array.prototype.slice.call(results).sort((a, b) => b.statistics.text[sortBy] - a.statistics.text[sortBy]) as ProfileDocument[] | GuildProfileDocument[],
        voice: Array.prototype.slice.call(results).sort((a, b) => b.statistics.voice[sortBy] - a.statistics.voice[sortBy]) as ProfileDocument[] | GuildProfileDocument[]
    }
}

async function formatList(sortType: string, isGlobal: boolean, executorProfile: ProfileDocument | GuildProfileDocument, profiles: SortedProfiles) {
    const collection: { coins: string[], text: string[], voice: string[] } = { coins: [], text: [], voice: [] }
    const sortBy = sortType === 'xp' ? 'totalXp' : 'level';
    for await (const [key, value] of Object.entries(profiles)) {
        let executorAppears = false
        for await (const [index, profile] of value.entries()) {
            if(index >= 10) break

            const isExecutor = executorProfile.userId === profile.userId
            if(isExecutor) executorAppears = true

            const userString = await formatUsername(profile.userId, isGlobal)

            if(sortType === 'coins' && 'coins' in profile) {
                collection[key as 'coins'].push(formatDisplayText(sortType, isExecutor, index+1, userString, profile.coins))
            }
            if(sortType === 'xp' || 'level' && key !== 'coins') {
                collection[key as 'text' | 'voice'].push(formatDisplayText(sortType, isExecutor, index+1, userString, profile.statistics[key as 'text' | 'voice'][sortBy]))
            }
        }

        if(!executorAppears) {
            const position = value.findIndex(profile => profile.userId === executorProfile.userId);
            const myProfile = value[position];

            const userString = await formatUsername(myProfile.userId, isGlobal)
            const amount = key === 'coins' && 'coins' in myProfile ? myProfile.coins : myProfile.statistics[key as 'text' | 'voice'][sortBy]
            collection[key as 'text' | 'voice' | 'coins'][9] = formatDisplayText(sortType, true, position, userString, amount)
        }
    }
    return collection
}

function formatDisplayText(sortType: string, isExecutor: boolean, position: number, user: string, amount: number) {
    const text = `#${position}. ${user} | ${amount} ${sortType}`
    return isExecutor ? Formatters.bold(text) : text
}

async function formatUsername(userId: Snowflake, isGlobal: boolean) {
    let userString: string = Formatters.userMention(userId);
    if(isGlobal) {
        const fetchedUser = await client.users.fetch(userId).catch(console.error)
        if(fetchedUser) userString = fetchedUser.tag
    }
    return userString
} 