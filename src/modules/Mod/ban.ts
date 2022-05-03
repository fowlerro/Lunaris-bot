import { Formatters, Guild, Permissions, Snowflake } from 'discord.js';

import Logs from '../Logs';
import { GuildBanModel } from '../../database/schemas/GuildBans';
import { getLocale } from '../../utils/utils';
import type { Language } from 'types';

export const Ban = {
	add: async (targetId: Snowflake, guildId: Snowflake, executorId: Snowflake, reason?: string, time?: number) => {
		if (!targetId) return { error: 'Missing targetId' };
		if (!guildId) return { error: 'Missing guildId' };
		const guild = await client.guilds.fetch(guildId).catch(logger.error);
		if (!guild) return { error: 'Wrong guildId' };
		if (!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
			return { error: 'missingPermission', perms: new Permissions([Permissions.FLAGS.BAN_MEMBERS]).toArray() };
		const target =
			(await guild.members.fetch(targetId).catch(logger.error)) ||
			(await client.users.fetch(targetId).catch(logger.error));
		if (!target) return { error: 'Wrong targetId' };
		if ('bannable' in target && !target.bannable) return { error: 'targetNotManagable' };
		const language = getLocale(guild.preferredLocale);

		let timestamp: number = 0;
		const date = Date.now();
		if (time) timestamp = date + time;
		if (!timestamp) {
			const result = await guild.bans.create(targetId, { reason }).catch(logger.error);
			await Logs.log('members', 'ban', guild.id, {
				member: target,
				customs: {
					moderatorMention: `<@${executorId}>`,
					moderatorId: executorId,
					reason: reason || t('general.none', language),
					unbanDate: t('general.never', language),
					unbanDateR: ' ',
				},
			});

			return { error: null, result };
		}
		const result = await saveBan(targetId, guild, executorId, reason, time, timestamp);
		if (!result) return { error: 'Something went wrong' };

		return { result };
	},
	remove: async (targetId: Snowflake, guildId: Snowflake, executorId: Snowflake, reason?: string) => {
		if (!targetId) return { error: 'Missing targetId' };
		if (!guildId) return { error: 'Missing guildId' };
		const guild = await client.guilds.fetch(guildId).catch(logger.error);
		if (!guild) return { error: 'Wrong guildId' };
		if (!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS))
			return { error: 'missingPermission', perms: new Permissions([Permissions.FLAGS.BAN_MEMBERS]).toArray() };
		const target = await client.users.fetch(targetId).catch(logger.error);
		if (!target) return { error: 'Wrong targetId' };
		const language = getLocale(guild.preferredLocale);

		const result = await guild.bans.remove(targetId, reason).catch(logger.error);
		if (!result) return { error: 'notBanned' };
		await Logs.log('members', 'unban', guild.id, {
			member: target,
			customs: {
				moderatorMention: `<@${executorId}>`,
				moderatorId: executorId,
				reason: reason || t('general.none', language),
			},
		});

		return { result };
	},
};

async function saveBan(
	userId: Snowflake,
	guild: Guild,
	executorId: Snowflake,
	reason?: string,
	time?: number,
	timestamp?: number
) {
	const language = getLocale(guild.preferredLocale);
	const user = await client.users.fetch(userId).catch(logger.error);
	const result = await guild.bans.create(userId, { reason }).catch(logger.error);
	if (!result) return;

	await GuildBanModel.findOneAndUpdate(
		{ guildId: guild.id, userId },
		{
			executorId,
			reason,
			time: timestamp,
		},
		{ upsert: true, runValidators: true }
	).catch(logger.error);

	await Logs.log('members', 'ban', guild.id, {
		member: user,
		customs: {
			moderatorMention: `<@${executorId}>`,
			moderatorId: executorId,
			reason: reason || t('general.none', language),
			unbanDate: timestamp ? Formatters.time(Math.floor(timestamp / 1000)) : t('general.never', language),
			unbanDateR: timestamp ? Formatters.time(Math.floor(timestamp / 1000), 'R') : ' ',
		},
	});

	setTimeout(async () => {
		if (!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return;
		const unbanReason = t('command.ban.removeReason', language, { reason: reason || t('general.none', language) });
		await guild.bans.remove(userId, unbanReason).catch(logger.error);
		await GuildBanModel.findOneAndDelete({ userId, guildId: guild.id }).catch(logger.error);
		await Logs.log('members', 'unban', guild.id, {
			member: user,
			customs: { moderatorMention: `<@${client.user?.id}>`, moderatorId: client.user?.id, reason: unbanReason },
		});
	}, time);

	return true;
}

export async function registerBans() {
	const bans = await GuildBanModel.find().catch(logger.error);
	if (!bans) return;
	for (const ban of bans) {
		const guild = await client.guilds.fetch(ban.guildId).catch(logger.error);
		if (!guild) return;

		const language = getLocale(guild.preferredLocale);
		const unbanReason = t('command.ban.removeReason', language, { reason: ban.reason || t('general.none', language) });

		const user = await client.users.fetch(ban.userId).catch(logger.error);
		if (!user) return;

		if (ban.time && ban.time < Date.now()) {
			await guild.bans.remove(user.id, unbanReason).catch(logger.error);

			return ban.remove().catch(logger.error);
		}
		setTimeout(async () => {
			await guild.bans.remove(user.id, unbanReason).catch(logger.error);

			ban.remove().catch(logger.error);
		}, (ban.time || 0) - Date.now());
	}
}
