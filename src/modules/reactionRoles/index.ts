import { Snowflake } from 'discord.js';

import BaseModule from '@utils/structures/BaseModule';

import { ReactionRoleItem, ReactionRoleModel } from '@schemas/ReactionRoles';
import createReactionCollector from './reactions';

export const REACTION_ROLE_TYPES = ['reactions', 'buttons', 'selects'] as const;
export const REACTION_ROLE_ACTIONS = ['add', 'remove', 'toggle'] as const;
export type ReactionRoleType = typeof REACTION_ROLE_TYPES[number];
export type ReactionRoleAction = typeof REACTION_ROLE_ACTIONS[number];

class ReactionRolesModule extends BaseModule {
	constructor() {
		super('ReactionRoles', true);
	}

	async run() {
		logger.info(this.getName());
		await this.fetchMessages();
	}

	async fetchMessages() {
		console.time('ReactionRoles fetchMessages');
		const messages = await ReactionRoleModel.find().catch(logger.error);
		if (!messages) return;
		for (const msg of messages) {
			const guild = await client.guilds.fetch(msg.guildId).catch(logger.error);
			if (!guild) continue;
			const channel = await guild.channels.fetch(msg.channelId).catch(logger.error);
			if (!channel || channel.type !== 'GUILD_TEXT') continue;
			const message = await channel.messages.fetch(msg.messageId).catch(logger.error);
			if (!message) continue;

			if (msg.type === 'reactions') createReactionCollector(msg, message);
		}
		console.timeEnd('ReactionRoles fetchMessages');
	}

	async create(
		guildId: Snowflake,
		channelId: Snowflake,
		messageId: Snowflake,
		type: ReactionRoleType,
		reactions: ReactionRoleItem[]
	) {
		const guild = await client.guilds.fetch(guildId);
		const channel = await guild.channels.fetch(channelId);
		if (!channel || channel.type !== 'GUILD_TEXT') throw new Error('Channel must be a text channel');
		const message = await channel.messages.fetch(messageId);

		const createdReactionRoles = await ReactionRoleModel.create({
			guildId,
			channelId,
			messageId,
			type,
			reactions,
		});

		if (type === 'reactions') createReactionCollector(createdReactionRoles, message);
	}
}

export default new ReactionRolesModule();
