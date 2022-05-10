import { MessageEmbed, Snowflake, TextChannel } from 'discord.js';

import Profiles from '../Profiles';
import { GuildProfile } from '../../database/schemas/GuildProfile';
import TextFormatter from '../../utils/Formatters/Formatter';
import { getLocale, palette } from '../../utils/utils';
import type { Profile } from 'types';

import xpSystem from './index';
import levelRewards from './levelRewards';

export async function textLevelUp(
	profile: GuildProfile | Profile,
	channelId: Snowflake | null,
	xp: number,
	xpToAdd: number,
	xpNeeded: number
) {
	const rest = xp + xpToAdd - xpNeeded;

	profile.statistics.text.level += 1;
	profile.statistics.text.xp = rest;
	profile.statistics.text.totalXp += xpToAdd;
	profile.statistics.text.dailyXp += xpToAdd;

	'coins' in profile && (profile.coins += profile.statistics.text.level * (10 + profile.statistics.text.level * 2));
	'guildId' in profile && channelId && sendLevelUpMessage(profile, channelId);

	Profiles.set(profile);
	if ('guildId' in profile) await levelRewards(profile, true);

	return profile;
}

export async function voiceLevelUp(profile: GuildProfile | Profile, xp: number, xpToAdd: number, xpNeeded: number) {
	const rest = xp + xpToAdd - xpNeeded;

	profile.statistics.voice.level += 1;
	profile.statistics.voice.xp = rest;
	profile.statistics.voice.totalXp += xpToAdd;
	profile.statistics.voice.dailyXp += xpToAdd;
	profile.statistics.voice.timeSpent += 1;

	'coins' in profile && (profile.coins += profile.statistics.voice.level * (10 + profile.statistics.voice.level * 2));

	Profiles.set(profile);
	if ('guildId' in profile) await levelRewards(profile, false);

	return profile;
}

export async function sendLevelUpMessage(profile: GuildProfile, channelId: Snowflake) {
	const levelConfig = await xpSystem.get(profile.guildId);
	if (!levelConfig) return;
	const messageMode = levelConfig.levelUpMessage.mode;
	if (messageMode === 'off') return;
	const guild = await client.guilds.fetch(profile.guildId).catch(logger.error);
	if (!guild) return;
	const member = await guild.members.fetch(profile.userId).catch(logger.error);
	if (!member) return;
	const configChannelId = levelConfig.levelUpMessage.channelId;
	const channel =
		messageMode === 'currentChannel'
			? ((await guild.channels.fetch(channelId).catch(logger.error)) as TextChannel | void)
			: configChannelId && ((await guild.channels.fetch(configChannelId).catch(logger.error)) as TextChannel | void);
	if (!channel) return;
	const language = getLocale(guild.preferredLocale);

	const description = levelConfig.levelUpMessage?.messageFormat
		? TextFormatter(levelConfig.levelUpMessage.messageFormat, {
				member,
				guild,
				customs: { level: profile.statistics.text.level },
		  })
		: t('xp.levelUpMessage', language, {
				level: profile.statistics.text.level.toString(),
				user: `<@${profile.userId}>`,
		  });

	const embed = new MessageEmbed().setColor(palette.primary).setDescription(description);

	channel.send({ embeds: [embed] }).catch(logger.error);
}
