import { CommandInteraction, Formatters, MessageEmbed } from "discord.js";
import { Snowflake } from "discord-api-types";

import { GuildProfile, GuildProfileModel } from "../../../database/schemas/GuildProfile";
import Guilds from "../../../modules/Guilds";
import Profiles from "../../../modules/Profiles";

import BaseCommand from "../../../utils/structures/BaseCommand";
import { Profile, ProfileModel } from "../../../database/schemas/Profile";
import { palette } from "../../../utils/utils";
import { translate } from "../../../utils/languages/languages";

type SortType = 'xp' | 'level' | 'coins';

type SortedProfiles = {
    text?: Profile[] | GuildProfile[],
    voice?: Profile[] | GuildProfile[],
    coins?: Profile[],
}

export default class LanguageCommand extends BaseCommand {
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
        interaction.deferReply()

        const sortType = interaction.options.getString('sortby') as SortType || 'xp'
        const isGlobal = interaction.options.getBoolean('global') || false

        const executorProfile = isGlobal || sortType === 'coins' ? await Profiles.get(interaction.user.id) as Profile : await Profiles.get(interaction.user.id, interaction.guildId) as GuildProfile
        const { language } = await Guilds.config.get(interaction.guildId)

        const result = await fetchData(sortType, isGlobal, interaction.guildId)
        const formattedData = await formatList(sortType, isGlobal, executorProfile, result)

        const embed = new MessageEmbed()
        .setColor(palette.primary)
        .setFooter(translate(language, 'cmd.ranking.lastUpdate'))
        .setTimestamp(Profiles.lastSave);

        sortType === 'coins' ? embed.addField(translate(language, 'cmd.ranking.coins'), formattedData.coins.join('\n'), true) :
            embed.addField(translate(language, 'cmd.ranking.text'), formattedData.text.join('\n'), true)
                .addField(translate(language, 'cmd.ranking.voice'), formattedData.voice.join('\n'), true)

        interaction.editReply({
            embeds: [embed]
        })
    }
}

async function fetchData(sortType: string, isGlobal: boolean, guildId: Snowflake): Promise<SortedProfiles> {
    if(sortType === 'coins') {
        const results = isGlobal ? await ProfileModel.find() :
            await GuildProfileModel.aggregate([
                { $match: { guildId } },
                { $lookup: { from: 'profiles', localField: 'userId', foreignField: 'userId', as: 'id' } },
                { $unwind: '$id' },
                { $replaceRoot: { newRoot: '$id' } }
            ]) as Profile[]
        
        return { coins: results.sort((a, b) => b.coins - a.coins) }
    }

    const results = isGlobal ? await ProfileModel.find() as Profile[] : await GuildProfileModel.find({ guildId }) as GuildProfile[]
    const sortBy = sortType === 'xp' ? 'totalXp' : 'level'

    return {
        text: Array.prototype.slice.call(results).sort((a, b) => b.statistics.text[sortBy] - a.statistics.text[sortBy]) as Profile[] | GuildProfile[],
        voice: Array.prototype.slice.call(results).sort((a, b) => b.statistics.voice[sortBy] - a.statistics.voice[sortBy]) as Profile[] | GuildProfile[]
    }
}

async function formatList(sortType: string, isGlobal: boolean, executorProfile: Profile | GuildProfile, profiles: SortedProfiles) {
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
        const fetchedUser = await client.users.fetch(userId).catch((err) => console.log(err))
        if(fetchedUser) userString = fetchedUser.tag
    }
    return userString
} 