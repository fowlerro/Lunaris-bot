import { Message, VoiceState, Snowflake } from 'discord.js';

import BaseModule from '../../utils/structures/BaseModule';
import { GuildProfileModel } from '../../database/schemas/GuildProfile';
import { ProfileModel } from '../../database/schemas/Profile';
import { LevelConfigModel } from '../../database/schemas/LevelConfig';
import type { LevelConfig, LevelReward, LevelRewards, LevelUpMessage } from 'types';

import { handleTextXp } from './text';
import { handleVoiceXp } from './voice';

class LevelsModule extends BaseModule {
	constructor() {
		super('Levels', true);
	}

	async run() {}

	async get(guildId: Snowflake): Promise<LevelConfig | null> {
		const cachedConfig = cache.levelConfigs.get<LevelConfig>(guildId);
		if (cachedConfig) return cachedConfig;

		const document = await LevelConfigModel.findOne({ guildId }, '-_id, -__v').catch(logger.error);
		if (!document) return this.create(guildId);

		const config = document.toObject();
		cache.levelConfigs.set<LevelConfig>(guildId, config);
		return config;
	}

	async set(guildId: Snowflake, config: LevelConfig): Promise<LevelConfig> {
		if (config.multiplier < 0 || config.multiplier > 5) throw new Error('Level multiplier must be between 0 and 5');
		if (config.levelUpMessage.channelId) {
			if (config.levelUpMessage.channelId.length !== 18) throw new Error('Invalid channelId');

			const guild = await client.guilds.fetch(guildId);
			const channel = await guild.channels.fetch(config.levelUpMessage.channelId);
			if (!channel) throw new Error('Invalid channelId');
		}
		if (config.rewards.text.length > 20 || config.rewards.voice.length > 20) throw new Error('Too many level rewards');

		const newConfig = await LevelConfigModel.findOneAndUpdate(
			{ guildId },
			{
				...config,
				multiplier: config.multiplier.toFixed(2),
			},
			{ upsert: true, new: true, runValidators: true, lean: true, fields: '-_id -__v' }
		);

		cache.levelConfigs.set<LevelConfig>(guildId, newConfig);

		return newConfig;
	}

	async create(guildId: Snowflake): Promise<LevelConfig | null> {
		const document = await LevelConfigModel.create({ guildId }).catch(logger.error);
		if (!document) return null;

		const config = document.toObject();
		delete config._id;
		delete config.__v;

		cache.levelConfigs.set<LevelConfig>(guildId, config);
		return config;
	}

	async setLevelUpMessage(guildId: Snowflake, format?: string | null): Promise<LevelConfig | null> {
		const document = await LevelConfigModel.findOneAndUpdate(
			{ guildId },
			{
				levelUpMessage: {
					messageFormat: format,
				},
			},
			{ upsert: true, new: true, runValidators: true }
		).catch(logger.error);
		if (!document) return null;

		const newConfig = document.toObject();
		delete newConfig._id;
		delete newConfig.__v;

		cache.levelConfigs.set<LevelConfig>(guildId, newConfig);
		return newConfig;
	}

	async setLevelUpChannel(
		guildId: Snowflake,
		mode: LevelUpMessage['mode'],
		channelId?: Snowflake
	): Promise<LevelConfig | null> {
		const document = await LevelConfigModel.findOneAndUpdate(
			{ guildId },
			{
				levelUpMessage: {
					mode,
					channelId,
				},
			},
			{ upsert: true, new: true, runValidators: true }
		).catch(logger.error);
		if (!document) return null;

		const newConfig = document.toObject();
		delete newConfig._id;
		delete newConfig.__v;

		cache.levelConfigs.set<LevelConfig>(guildId, newConfig);
		return newConfig;
	}

	async setMultiplier(guildId: Snowflake, multiplier: number): Promise<LevelConfig | null> {
		const document = await LevelConfigModel.findOneAndUpdate(
			{ guildId },
			{
				multiplier,
			},
			{ upsert: true, new: true, runValidators: true }
		).catch(logger.error);
		if (!document) return null;

		const newConfig = document.toObject();
		delete newConfig._id;
		delete newConfig.__v;

		cache.levelConfigs.set<LevelConfig>(guildId, newConfig);
		return newConfig;
	}

	async addReward(guildId: Snowflake, reward: LevelReward, scope: 'text' | 'voice') {
		const config = await this.get(guildId);
		if (!config) return null;
		if (config.rewards[scope].length >= 20) return { error: 'rewardsLimit' };

		const document = await LevelConfigModel.findOneAndUpdate(
			{ guildId },
			{
				$push: { [`rewards.${scope}`]: reward },
			},
			{ upsert: true, new: true, runValidators: true }
		).catch(logger.error);
		if (!document) return null;

		const newConfig = document.toObject();
		delete newConfig._id;
		delete newConfig.__v;

		cache.levelConfigs.set<LevelConfig>(guildId, newConfig);
		return newConfig;
	}

	async removeReward(guildId: Snowflake, rewardId: string, scope: 'text' | 'voice') {
		const document = await LevelConfigModel.findOneAndUpdate(
			{ guildId, [`rewards.${scope}`]: { $elemMatch: { _id: rewardId } } },
			{
				$pull: { [`rewards.${scope}`]: { _id: rewardId } },
			},
			{ new: true, upsert: true, runValidators: true }
		).catch(logger.error);
		if (!document) return;

		const newConfig = document.toObject();
		delete newConfig._id;
		delete newConfig.__v;

		cache.levelConfigs.set<LevelConfig>(guildId, newConfig);
		return newConfig;
	}

	async rewardList(guildId: Snowflake): Promise<LevelRewards | null>;
	async rewardList(guildId: Snowflake, scope: 'text' | 'voice'): Promise<LevelReward[] | null>;
	async rewardList(guildId: Snowflake, scope?: 'text' | 'voice'): Promise<LevelRewards | LevelReward[] | null>;
	async rewardList(guildId: Snowflake, scope?: 'text' | 'voice'): Promise<LevelRewards | LevelReward[] | null> {
		const config = await this.get(guildId);
		if (!config) return null;
		if (scope === 'text') return config.rewards.text;
		if (scope === 'voice') return config.rewards.voice;

		return config.rewards;
	}

	async handleTextXp(message: Message) {
		return handleTextXp(message);
	}

	async handleVoiceXp(oldState: VoiceState, newState: VoiceState) {
		return handleVoiceXp(oldState, newState);
	}

	async resetDailyXp() {
		await GuildProfileModel.updateMany(
			{ $or: [{ 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } }] },
			{
				'statistics.text.dailyXp': 0,
				'statistics.voice.dailyXp': 0,
			}
		).catch(logger.error);
		await ProfileModel.updateMany(
			{ $or: [{ 'statistics.text.dailyXp': { $gte: 1 } }, { 'statistics.voice.dailyXp': { $gte: 1 } }] },
			{
				'statistics.text.dailyXp': 0,
				'statistics.voice.dailyXp': 0,
			}
		).catch(logger.error);
		cache.profiles.flushAll();
		cache.guildProfiles.flushAll();
	}
}

export default new LevelsModule();
