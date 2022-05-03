import { CommandInteraction, Formatters, MessageEmbed } from 'discord.js';

import Mod from '@modules/Mod';
import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';

import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guildId) return;
	const userId = interaction.options.getString('user-id', true);
	if (isNaN(+userId) || userId.length !== 18) return handleCommandError(interaction, 'command.wrongId');

	const member = userId && (await client.users.fetch(userId).catch(logger.error));
	if (!member || !('id' in member)) return handleCommandError(interaction, 'command.ban.notFound');

	const reason = interaction.options.getString('reason') || undefined;

	const result = await Mod.ban.remove(member.id, interaction.guildId, interaction.user.id, reason);
	if (result.error === 'missingPermission') return handleCommandError(interaction, 'command.ban.missingPermissions');
	if (result.error === 'notBanned') return handleCommandError(interaction, 'command.ban.notBanned');
	if (result.error) return handleCommandError(interaction, 'general.error');

	const description = t('command.ban.remove', language, {
		member: `<@${member.id}>`,
		executor: `<@${interaction.user.id}>`,
	});

	const embed = new MessageEmbed()
		.setColor(palette.success)
		.setDescription(description)
		.addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)));

	return interaction
		.reply({
			embeds: [embed],
		})
		.catch(logger.error);
}
