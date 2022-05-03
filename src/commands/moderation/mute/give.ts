import { CommandInteraction, Formatters, MessageEmbed } from 'discord.js';
import ms from 'ms';

import Mod from '@modules/Mod';
import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';

import type { Language } from 'types';

const regex = /[0-9]+[d|h|m|s]/g;

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guild || !interaction.guildId || !interaction.member) return;
	if (!('id' in interaction.member)) return;
	const member = interaction.options.getMember('member', true);
	if (!('id' in member)) return handleCommandError(interaction, 'general.error');
	const userTime = interaction.options.getString('time');
	const reason = interaction.options.getString('reason') || undefined;
	let time = 0;
	if (userTime && userTime.match(regex)) for (const entry of userTime.match(regex)!) time += ms(entry);

	if (!time) return handleCommandError(interaction, 'command.mute.incorectTime');
	const result = await Mod.mute.add(member, interaction.member, time, reason);
	if (result?.error === 'executorWithoutPermissions')
		return handleCommandError(interaction, 'command.executorWithoutPermission');
	if (result?.error === 'notModeratable') return handleCommandError(interaction, 'command.mute.notModeratable');
	if (result?.error === 'alreadyTimedOut') return handleCommandError(interaction, 'command.mute.alreadyTimedOut');
	if (result?.error) return handleCommandError(interaction, 'general.error');

	const description = t('command.mute.addMute', language, {
		member: `<@${member.id}>`,
		executor: `<@${interaction.user.id}>`,
	});

	const embed = new MessageEmbed()
		.setColor(palette.success)
		.setDescription(description)
		.addField(
			t('general.until', language),
			`${Formatters.time(Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000))}\n${Formatters.time(
				Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000),
				'R'
			)}`
		)
		.addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)));

	return interaction
		.reply({
			embeds: [embed],
		})
		.catch(logger.error);
}
