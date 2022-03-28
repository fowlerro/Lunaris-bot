import { Snowflake } from 'discord.js';

import BaseModule from '../../utils/structures/BaseModule';
import { GuildConfigModel } from '../../database/schemas/GuildConfig';
import type { GuildConfig } from 'types';

class GuildsModule extends BaseModule {
	constructor() {
		super('Guilds', true);
	}

	async run() {
		logger.info(this.getName());
		await createNewGuildConfigs();
	}

	config = {
		get: async (guildId: Snowflake): Promise<GuildConfig | null> => {
			const cachedConfig = cache.guildConfigs.get<GuildConfig>(guildId);
			if (cachedConfig) return cachedConfig;

			const document = await GuildConfigModel.findOne({ guildId }).select('-_id -__v').catch(logger.error);
			if (!document) return this.config.create(guildId);

			const config = document.toObject();
			cache.guildConfigs.set(guildId, config);
			return config;
		},
		set: async (guildId: Snowflake, toSet: any): Promise<GuildConfig | null> => {
			const document = await GuildConfigModel.findOneAndUpdate({ guildId }, toSet, {
				new: true,
				upsert: true,
				runValidators: true,
				lean: true,
				fields: '-_id -__v',
			})
				.exec()
				.catch(logger.error);
			if (!document) return null;

			cache.guildConfigs.set(guildId, document);
			return document;
		},
		create: async (guildId: Snowflake): Promise<GuildConfig | null> => {
			const document = await GuildConfigModel.create({ guildId }).catch(logger.error);
			if (!document) return null;

			const { _id, __v, ...config } = document.toObject();
			cache.guildConfigs.set(guildId, config);

			return config;
		},
		delete: async (guildId: Snowflake) => {
			cache.guildConfigs.del(guildId);
			await GuildConfigModel.deleteOne({ guildId }).catch(logger.error);
		},
	};
}

async function createNewGuildConfigs() {
	const allGuilds = await client.guilds.fetch().catch(logger.error);
	if (!allGuilds) return;
	const allConfigs = await GuildConfigModel.find({}, 'guildId').exec().catch(logger.error);
	if (!allConfigs) return;
	if (allGuilds.size <= allConfigs.length) return;
	logger.warn(JSON.stringify({ allGuilds, allConfigs }));

	allGuilds.forEach(async guild => {
		if (allConfigs.some(g => g.guildId !== guild.id))
			await GuildConfigModel.create({ guildId: guild.id }).catch(logger.error); // TODO Remove guild from allGuilds after creating config for it
	});
}

export default new GuildsModule();
