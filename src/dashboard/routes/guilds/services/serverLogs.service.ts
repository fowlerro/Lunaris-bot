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
	//! TODO CHECK BEFORE SAVING TO DATABASE
	const updatedServerLogs = await GuildLogsModel.findOneAndUpdate(
		{ guildId },
		{
			logs: serverLogs,
		},
		{
			new: true,
			upsert: true,
			runValidators: true,
			lean: true,
			fields: '-_id -__v',
		}
	);
	if (!updatedServerLogs) throw new Error("Couldn't update server logs");

	cache.logConfigs.set<GuildLogs>(guildId, updatedServerLogs);

	return {
		status,
		serverLogs,
	};
}
