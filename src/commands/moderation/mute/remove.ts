import { handleCommandError } from '@commands/errors';
import Mod from '@modules/Mod';
import { palette } from '@utils/utils';
import { CommandInteraction, Formatters, MessageEmbed } from 'discord.js';
import { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guild || !interaction.guildId || !interaction.member) return;
	if (!('id' in interaction.member)) return;
	const member = interaction.options.getMember('member', true);
	if (!('id' in member)) return;
	const reason = interaction.options.getString('reason') || undefined;

	const result = await Mod.mute.remove(member, interaction.member, reason);
	if (result?.error === 'executorWithoutPermissions')
		return handleCommandError(interaction, 'command.executorWithoutPermission');
	if (result?.error === 'notModeratable') return handleCommandError(interaction, 'command.mute.notModeratable');
	if (result?.error === 'notTimedOut') return handleCommandError(interaction, 'command.mute.notTimedOut');
	if (result?.error) return handleCommandError(interaction, 'general.error');

	const description = t('command.mute.removeMute', language, {
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
