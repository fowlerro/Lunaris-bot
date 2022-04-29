import { ButtonInteraction, SelectMenuInteraction, Snowflake } from 'discord.js';

import { InteractiveRolesModel } from '@schemas/InteractiveRoles';
import BaseModule from '@utils/structures/BaseModule';

import createReactionCollector from './reactions';
import createInteractiveRoleButtons from './buttons';
import createInteractiveRoleSelect from './selects';

import type { InteractiveRolesType } from 'types';

export const INTERACTIVE_ROLE_TYPES = ['reactions', 'buttons', 'select'] as const;
export const INTERACTIVE_ROLE_ACTIONS = ['add', 'remove', 'toggle'] as const;
export const INTERACTIVE_ROLE_STYLES = ['PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER'] as const;

class InteractiveRolesModule extends BaseModule {
	constructor() {
		super('InteractiveRoles', true);
	}

	async run() {
		logger.info(this.getName());
		await this.fetchMessages();
	}

	async fetchMessages() {
		const messages = await InteractiveRolesModel.find().catch(logger.error);
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
	}

	async get(interactiveRoleId: string) {
		return InteractiveRolesModel.findById(interactiveRoleId).lean().select('-__v').exec();
	}

	async list(guildId: Snowflake) {
		return InteractiveRolesModel.find({ guildId }).select('-__v').lean().exec();
	}

	async delete(guildId: Snowflake, interactiveRoleId: string) {
		return InteractiveRolesModel.deleteOne({ _id: interactiveRoleId, guildId }).exec();
	}

	async create(interactiveRole: InteractiveRolesType) {
		const { _id, name, guildId, channelId, messageId, embedId, type, placeholder, roles } = interactiveRole;
		const guild = await client.guilds.fetch(guildId);
		const channel = await guild.channels.fetch(channelId);
		if (!channel || channel.type !== 'GUILD_TEXT') throw new Error('Channel must be a text channel');
		const message = await channel.messages.fetch(messageId);
		if ((type === 'buttons' || type === 'select') && message.author.id !== client?.user?.id)
			throw new Error('Message must be sent by bot');

		const interactiveRolesCount = await InteractiveRolesModel.countDocuments({ guildId });
		if (interactiveRolesCount >= 10) throw new Error('Interactive Roles limit reached');

		const createdInteractiveRoles = await InteractiveRolesModel.findOneAndUpdate(
			{ _id, guildId, channelId, messageId, embedId },
			{
				name,
				guildId,
				channelId,
				messageId,
				embedId,
				type,
				placeholder,
				roles,
			},
			{ new: true, upsert: true, runValidators: true, fields: '-__v', lean: true }
		).catch(logger.error);
		if (!createdInteractiveRoles) throw new Error('Failed to create Interactive Roles');

		if (type === 'reactions') createReactionCollector(createdInteractiveRoles, message);
		if (type === 'buttons') createInteractiveRoleButtons(createdInteractiveRoles, message);
		if (type === 'select') createInteractiveRoleSelect(createdInteractiveRoles, message);
	}

	async handleButtons(interaction: ButtonInteraction) {
		if (!interaction.customId.startsWith('IR-')) return;
		const [, interactiveRoleId, interactiveRoleItemId] = interaction.customId.split('-');
		const interactiveRole = await this.get(interactiveRoleId);
		if (!interactiveRole) return;

		const interactiveRoleItem = interactiveRole.roles.find(role => role._id?.toString() === interactiveRoleItemId);
		if (!interactiveRoleItem) return;

		const memberId = interaction.member?.user?.id;
		if (!memberId) return;
		const member = await interaction.guild?.members.fetch(memberId);
		if (!member) return;
		const hasRole = member.roles.cache.has(interactiveRoleItem.roleId);
		if (interactiveRoleItem.action === 'add') {
			if (hasRole) return interaction.update({});
			await member.roles.add(interactiveRoleItem.roleId);
		}
		if (interactiveRoleItem.action === 'remove') {
			if (!hasRole) return interaction.update({});
			await member.roles.remove(interactiveRoleItem.roleId);
		}
		if (interactiveRoleItem.action === 'toggle') {
			if (hasRole) await member.roles.remove(interactiveRoleItem.roleId);
			else await member.roles.add(interactiveRoleItem.roleId);
		}

		return interaction.update({});
	}

	async handleSelect(interaction: SelectMenuInteraction) {
		if (!interaction.customId.startsWith('IR-')) return;
		const [, interactiveRoleId] = interaction.customId.split('-');
		const interactiveRole = await this.get(interactiveRoleId);
		if (!interactiveRole) return;

		const memberId = interaction.member?.user?.id;
		if (!memberId) return;
		const member = await interaction.guild?.members.fetch(memberId);
		if (!member) return;

		interactiveRole.roles.forEach(async role => {
			const isSelected = interaction.values.includes(role._id!.toString());
			const hasRole = member.roles.cache.has(role.roleId);
			if (isSelected && !hasRole) await member.roles.add(role.roleId);
			if (!isSelected && hasRole) await member.roles.remove(role.roleId);
		});

		return interaction.deferUpdate();
	}
}

export default new InteractiveRolesModule();
