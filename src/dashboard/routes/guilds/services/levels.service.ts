import { Snowflake } from 'discord.js';

import Guilds from '../../../../modules/Guilds';
import Levels from '../../../../modules/Levels';

import type { LevelConfigPageData } from 'types';

export async function getLevelConfigService(guildId: Snowflake): Promise<LevelConfigPageData> {
	const guildConfig = await Guilds.config.get(guildId);
	if (!guildConfig) throw new Error('Guild config not found');

	const levelConfig = await Levels.get(guildId);
	if (!levelConfig) throw new Error('Server Logs config not found');

	return {
		status: guildConfig.modules.levels,
		levelConfig,
	};
}

export async function setLevelConfigService(
	guildId: Snowflake,
	payload: LevelConfigPageData
): Promise<LevelConfigPageData> {
	const { status, levelConfig } = payload;
	if (!levelConfig) throw new Error('Invalid payload');
	const guildConfig = await Guilds.config.get(guildId);

	if (guildConfig?.modules.levels !== status) {
		const updatedGuildConfig = await Guilds.config.set(guildId, { 'modules.levels': status });
		if (!updatedGuildConfig) throw new Error("Couldn't update guild config");
	}

	const updatedConfig = await Levels.set(guildId, levelConfig);

	return {
		status,
		levelConfig: updatedConfig,
	};
}
