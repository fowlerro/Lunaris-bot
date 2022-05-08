import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

import { GuildProfile, GuildProfileModel } from '@schemas/GuildProfile';
import Profiles from '@modules/Profiles';
import { handleCommandError } from '@commands/errors';

import type { Command } from 'src/typings/command';
import type { Profile } from 'types';
import { Formatters, MessageEmbed, Snowflake } from 'discord.js';
import { palette } from '@utils/utils';
import { ProfileModel } from '@schemas/Profile';

type SortType = 'xp' | 'level';

type SortedProfiles = {
	text: Profile[] | GuildProfile[];
	voice: Profile[] | GuildProfile[];
};

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'ranking',
	},
	description: {
		en: 'Display ranking',
		pl: 'Wyświetl ranking',
	},
	dm: false,
	permissions: undefined,
	options: [
		{
			type: ApplicationCommandOptionTypes.BOOLEAN,
			name: {
				en: 'global',
			},
			description: {
				en: 'Select this option to display global ranking',
				pl: 'Wyświetl tę opcję aby wyświetlić globalny ranking',
			},
		},
		{
			type: ApplicationCommandOptionTypes.STRING,
			name: {
				en: 'sort-by',
			},
			description: {
				en: 'Display ranking by XP or level',
				pl: 'Wyświetl ranking przez XP lub poziom',
			},
			choices: [
				{
					name: {
						en: 'XP',
					},
					value: 'xp',
				},
				{
					name: {
						en: 'Level',
					},
					value: 'level',
				},
			],
		},
	],
	run: async (interaction, language) => {
		if (!interaction.guildId) return;
		await interaction.deferReply();

		const sortType = (interaction.options.getString('sort-by') as SortType) || 'xp';
		const isGlobal = interaction.options.getBoolean('global') || false;

		const executorProfile = isGlobal
			? await Profiles.get(interaction.user.id)
			: await Profiles.get(interaction.user.id, interaction.guildId);
		const result = await fetchData(sortType, isGlobal, interaction.guildId);
		if (!result || !executorProfile) return handleCommandError(interaction, 'general.error');
		const formattedData = await formatList(sortType, isGlobal, executorProfile, result);

		const embed = new MessageEmbed()
			.setColor(palette.primary)
			.setFooter({ text: t('command.ranking.lastUpdate', language) })
			.setTimestamp(Profiles.lastSave)
			.addField(t('command.ranking.text', language), formattedData.text.join('\n'), true)
			.addField(t('command.ranking.voice', language), formattedData.voice.join('\n'), true);

		interaction
			.editReply({
				embeds: [embed],
			})
			.catch(logger.error);
	},
} as Command;

async function fetchData(sortType: string, isGlobal: boolean, guildId: Snowflake): Promise<SortedProfiles | null> {
	const results = isGlobal
		? ((await ProfileModel.find().lean().exec().catch(logger.error)) as Profile[] | void)
		: ((await GuildProfileModel.find({ guildId }).lean().exec().catch(logger.error)) as GuildProfile[] | void);
	if (!results) return null;
	const sortBy = sortType === 'xp' ? 'totalXp' : 'level';

	return {
		text: Array.prototype.slice.call(results).sort((a, b) => b.statistics.text[sortBy] - a.statistics.text[sortBy]) as
			| Profile[]
			| GuildProfile[],
		voice: Array.prototype.slice
			.call(results)
			.sort((a, b) => b.statistics.voice[sortBy] - a.statistics.voice[sortBy]) as Profile[] | GuildProfile[],
	};
}

async function formatList(
	sortType: string,
	isGlobal: boolean,
	executorProfile: Profile | GuildProfile,
	profiles: SortedProfiles
) {
	const collection: { text: string[]; voice: string[] } = { text: [], voice: [] };
	const sortBy = sortType === 'xp' ? 'totalXp' : 'level';
	for await (const [key, value] of Object.entries(profiles)) {
		let executorAppears = false;
		for await (const [index, profile] of value.entries()) {
			if (index >= 10) break;

			const isExecutor = executorProfile.userId === profile.userId;
			if (isExecutor) executorAppears = true;

			const userString = await formatUsername(profile.userId, isGlobal);

			collection[key as 'text' | 'voice'].push(
				formatDisplayText(
					sortType,
					isExecutor,
					index + 1,
					userString,
					profile.statistics[key as 'text' | 'voice'][sortBy]
				)
			);
		}

		if (!executorAppears) {
			const position = value.findIndex(profile => profile.userId === executorProfile.userId);
			const myProfile = value[position];

			const userString = await formatUsername(myProfile.userId, isGlobal);
			const amount = myProfile.statistics[key as 'text' | 'voice'][sortBy];
			collection[key as 'text' | 'voice'][9] = formatDisplayText(sortType, true, position, userString, amount);
		}
	}
	return collection;
}

function formatDisplayText(sortType: string, isExecutor: boolean, position: number, user: string, amount: number) {
	const text = `#${position}. ${user} | ${amount} ${sortType}`;
	return isExecutor ? Formatters.bold(text) : text;
}

async function formatUsername(userId: Snowflake, isGlobal: boolean) {
	let userString: string = Formatters.userMention(userId);
	if (isGlobal) {
		const fetchedUser = await client.users.fetch(userId).catch(logger.error);
		if (fetchedUser) userString = fetchedUser.tag;
	}
	return userString;
}
