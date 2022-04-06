import { Snowflake } from 'discord.js';

import Guilds from '../../../../modules/Guilds';
import Logs from '../../../../modules/Logs';

import type { GuildLogs, GuildLogsPageData } from 'types';
import { GuildLogsModel } from '../../../../database/schemas/GuildLogs';

export async function getServerLogsService(guildId: Snowflake): Promise<GuildLogsPageData> {
	const guildConfig = await Guilds.config.get(guildId);
	if (!guildConfig) throw new Error('Guild config not found');

	const serverLogsConfig = await Logs.get(guildId);
	if (!serverLogsConfig) throw new Error('Server Logs config not found');

	return {
		status: guildConfig.modules.serverLogs,
		serverLogs: serverLogsConfig.logs,
	};
}

export async function setServerLogsService(guildId: Snowflake, payload: GuildLogsPageData): Promise<GuildLogsPageData> {
	const { status, serverLogs } = payload;
	if (!serverLogs) throw new Error('Invalid payload');
	const guildConfig = await Guilds.config.get(guildId);

	if (guildConfig?.modules.serverLogs !== status) {
		const updatedGuildConfig = await Guilds.config.set(guildId, { 'modules.serverLogs': status });
		if (!updatedGuildConfig) throw new Error("Couldn't update guild config");
	}

	const logsToUpdate: GuildLogs['logs'] = {
		channels: {
			channelId: serverLogs.channels.channelId || undefined,
			logs: {
				create: serverLogs.channels.logs.create,
				delete: serverLogs.channels.logs.delete,
				edit: serverLogs.channels.logs.edit,
			},
		},
		emojis: {
			channelId: serverLogs.emojis.channelId || undefined,
			logs: {
				create: serverLogs.emojis.logs.create,
				delete: serverLogs.emojis.logs.delete,
				edit: serverLogs.emojis.logs.edit,
			},
		},
		invites: {
			channelId: serverLogs.invites.channelId || undefined,
			logs: {
				create: serverLogs.invites.logs.create,
				delete: serverLogs.invites.logs.delete,
			},
		},
		messages: {
			channelId: serverLogs.messages.channelId || undefined,
			logs: {
				delete: serverLogs.messages.logs.delete,
				edit: serverLogs.messages.logs.edit,
				purge: serverLogs.messages.logs.purge,
				pin: serverLogs.messages.logs.pin,
				unpin: serverLogs.messages.logs.unpin,
			},
		},
		roles: {
			channelId: serverLogs.roles.channelId || undefined,
			logs: {
				create: serverLogs.roles.logs.create,
				delete: serverLogs.roles.logs.delete,
				edit: serverLogs.roles.logs.edit,
				add: serverLogs.roles.logs.add,
				remove: serverLogs.roles.logs.remove,
			},
		},
		threads: {
			channelId: serverLogs.threads.channelId || undefined,
			logs: {
				create: serverLogs.threads.logs.create,
				delete: serverLogs.threads.logs.delete,
				edit: serverLogs.threads.logs.edit,
			},
		},
		members: {
			channelId: serverLogs.members.channelId || undefined,
			logs: {
				join: serverLogs.members.logs.join,
				leave: serverLogs.members.logs.leave,
				ban: serverLogs.members.logs.ban,
				unban: serverLogs.members.logs.unban,
				kick: serverLogs.members.logs.kick,
				warn: serverLogs.members.logs.warn,
				unwarn: serverLogs.members.logs.unwarn,
				unwarnAll: serverLogs.members.logs.unwarnAll,
				timeout: serverLogs.members.logs.timeout,
				timeoutRemove: serverLogs.members.logs.timeoutRemove,
				nicknameChange: serverLogs.members.logs.nicknameChange,
			},
		},
		server: {
			channelId: serverLogs.server.channelId || undefined,
			logs: {
				unwarnAll: serverLogs.server.logs.unwarnAll,
			},
		},
	};

	const updatedServerLogs = await GuildLogsModel.findOneAndUpdate(
		{ guildId },
		{ logs: logsToUpdate },
		{ new: true, upsert: true, runValidators: true, lean: true, fields: '-_id -__v' }
	);
	if (!updatedServerLogs) throw new Error("Couldn't update server logs");

	cache.logConfigs.set<GuildLogs>(guildId, updatedServerLogs);

	return {
		status,
		serverLogs,
	};
}
