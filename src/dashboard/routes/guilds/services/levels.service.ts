import { Snowflake } from 'discord.js';

import Guilds from '../../../../modules/Guilds';
import Levels from '../../../../modules/Levels';

import type { LevelConfig, LevelConfigPageData } from 'types';

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

	const levelConfigToUpdate: LevelConfig = {
		guildId,
		multiplier: Math.round((levelConfig.multiplier + Number.EPSILON) * 100) / 100,
		levelUpMessage: {
			channelId: levelConfig.levelUpMessage.channelId,
			mode: levelConfig.levelUpMessage.mode,
			messageFormat: levelConfig.levelUpMessage.messageFormat,
		},
		rewards: {
			text: levelConfig.rewards.text.map(reward => ({
				_id: reward._id,
				level: reward.level,
				roleId: reward.roleId,
				takePreviousRole: reward.takePreviousRole,
			})),
			voice: levelConfig.rewards.voice.map(reward => ({
				_id: reward._id,
				level: reward.level,
				roleId: reward.roleId,
				takePreviousRole: reward.takePreviousRole,
			})),
		},
	};

	const updatedConfig = await Levels.set(guildId, levelConfigToUpdate);

	return {
		status,
		levelConfig: updatedConfig,
	};
}
