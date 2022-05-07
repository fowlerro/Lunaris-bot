import { AutocompleteInteraction } from 'discord.js';

export default async function (interaction: AutocompleteInteraction) {
	const inputEmoji = interaction.options.getString('emoji', true);
	const guildEmojis = await interaction.guild?.emojis.fetch().catch(logger.error);
	const emoji = guildEmojis?.filter(emoji => emoji.name?.toLowerCase()?.includes(inputEmoji.toLowerCase()) || false);

	const options = emoji?.map(emoji => ({
		name: emoji.name!,
		value: emoji.id,
	}))!;

	return interaction.respond(options.splice(0, 25)).catch(logger.error);
}
