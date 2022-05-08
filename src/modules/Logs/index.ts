import { ButtonInteraction, MessageActionRow, MessageEmbed, Snowflake, TextChannel } from 'discord.js';

import { GuildLogsModel } from '../../database/schemas/GuildLogs';
import TextFormatter from '../../utils/Formatters/Formatter';
import BaseModule from '../../utils/structures/BaseModule';
import { getLocale } from '../../utils/utils';

import type { LocalePhrase } from '../../typings/locales';
import type { Language, GuildLogs, GuildLogTypes } from 'types';

import Embeds from '../Embeds';
import actions from './actions';
import templates from './templates';
import Guilds from '@modules/Guilds';

class LogsModule extends BaseModule {
	constructor() {
		super('Logs', true);
	}

	async run() {}

	async get(guildId: Snowflake): Promise<GuildLogs | null> {
		const logs = cache.logConfigs.get<GuildLogs>(guildId);
		if (logs) return logs;

		const document = await GuildLogsModel.findOne({ guildId }).lean().select('-_id -__v').exec().catch(logger.error);
		if (!document) return this.create(guildId);

		cache.logConfigs.set<GuildLogs>(guildId, document);
		return document;
	}

	async set(guildId: Snowflake, category: keyof GuildLogTypes, channelId?: Snowflake): Promise<GuildLogs | null> {
		if (!Object.keys(templates).includes(category)) return null;

		const document = await GuildLogsModel.findOneAndUpdate(
			{ guildId },
			{
				$set: {
					[`logs.${category}.channelId`]: channelId,
				},
			},
			{ new: true, upsert: true, runValidators: true, lean: true, fields: '-_id -__v' }
		).catch(logger.error);
		if (!document) return null;

		cache.logConfigs.set<GuildLogs>(guildId, document);
		return document;
	}

	async toggle<T extends keyof GuildLogTypes>(
		guildId: Snowflake,
		category: T,
		log: GuildLogTypes[T],
		value: boolean
	): Promise<GuildLogs | null> {
		if (!Object.keys(templates).includes(category)) return null;
		if (!Object.keys(templates[category]).includes(log.toString())) return null;

		const document = await GuildLogsModel.findOneAndUpdate(
			{ guildId },
			{
				$set: {
					[`logs.${category}.logs.${log}`]: value,
				},
			},
			{ new: true, upsert: true, runValidators: true, lean: true, fields: '-_id -__v' }
		).catch(logger.error);
		if (!document) return null;

		cache.logConfigs.set<GuildLogs>(guildId, document);
		return document;
	}

	async create(guildId: Snowflake): Promise<GuildLogs | null> {
		const document = await GuildLogsModel.create({ guildId }).catch(logger.error);
		if (!document) return null;

		// @ts-ignore
		const { _id, __v, ...config } = document.toObject();
		cache.logConfigs.set<GuildLogs>(guildId, config);
		return config;
	}

	async log<T extends keyof GuildLogTypes, K extends GuildLogTypes[T]>(
		category: T,
		type: K,
		guildId: Snowflake,
		vars: any
	) {
		const guildConfig = await Guilds.config.get(guildId);
		if (!guildConfig || !guildConfig.modules.serverLogs) return;
		const config = await this.get(guildId);
		if (!config) return;
		const channelId = config?.logs?.[category]?.channelId;
		const isLogEnabled = config?.logs?.[category]?.logs?.[type];
		if (!channelId || !isLogEnabled) return;
		const guild = await client.guilds.fetch(guildId).catch(logger.error);
		if (!guild) return;
		const channel = (await guild.channels.fetch(channelId).catch(logger.error)) as TextChannel | void;
		if (!channel) return;
		const language = getLocale(guild.preferredLocale);

		const embed = this.formatTemplate(category, type, language, vars);

		const checkedEmbed = await Embeds.checkLimits(embed, false);
		if (checkedEmbed.error) return;
		const actionButtons = this.addActions(category, type, language, vars);

		channel
			.send({
				embeds: [checkedEmbed.pages[0]],
				components: actionButtons ? [actionButtons] : undefined,
			})
			.catch(logger.error);
	}

	formatTemplate<T extends keyof GuildLogTypes, K extends GuildLogTypes[T]>(
		category: T,
		type: K,
		language: Language,
		vars: any
	) {
		const template = templates[category][type];

		const fields = template.fields?.map(value => ({
			name: t(value.name as LocalePhrase, language),
			value: TextFormatter(value.value, vars),
			inline: value.inline,
		}));
		const embed = new MessageEmbed();

		template?.color && embed.setColor(template.color);
		template?.title && embed.setTitle(t(template.title as LocalePhrase, language));
		template?.author?.name &&
			embed.setAuthor({
				name: t(template.author.name as LocalePhrase, language),
				iconURL: TextFormatter(template.author?.iconURL || '', vars),
				url: template.author?.url,
			});
		template?.description && embed.setDescription(t(template.description as LocalePhrase, language));
		fields && embed.addFields(...fields);
		template?.image?.url && embed.setImage(TextFormatter(template.image.url, vars));
		template?.thumbnail?.url && embed.setThumbnail(TextFormatter(template.thumbnail.url, vars));
		template?.timestamp && embed.setTimestamp(template.timestamp);

		return embed;
	}

	addActions<T extends keyof GuildLogTypes, K extends GuildLogTypes[T]>(
		category: T,
		type: K,
		language: Language,
		vars: any
	) {
		// @ts-ignore
		const actionButtons = actions?.[category]?.[type]?.addActions?.(language, vars);
		if (!actionButtons || !actionButtons.length) return;
		const actionRow = new MessageActionRow().setComponents(actionButtons);

		return actionRow;
	}

	async handleAction(interaction: ButtonInteraction) {
		const customId = interaction.customId;
		const [log, category, logType] = customId.split('-');
		if (!log || log !== 'logs' || !category || !logType) return;
		// @ts-ignore
		actions?.[category]?.[logType]?.handleActions?.(interaction);
	}
}

export default new LogsModule();
