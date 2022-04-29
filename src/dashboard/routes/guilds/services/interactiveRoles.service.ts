import { Snowflake } from 'discord.js';

import InteractiveRoles from '@modules/InteractiveRoles';

import type { InteractiveRolesType } from 'types';
import { InteractiveRolesModel } from '@schemas/InteractiveRoles';
import Embeds from '@modules/Embeds';
import { EmbedModel } from '@schemas/Embed';

export async function getInteractiveRolesService(guildId: Snowflake): Promise<InteractiveRolesType[]> {
	const interactiveRolesList = await InteractiveRoles.list(guildId);
	if (!interactiveRolesList) throw new Error('Interactive Roles not found');

	return interactiveRolesList;
}

export async function saveInteractiveRolesService(
	guildId: Snowflake,
	interactiveRoles: InteractiveRolesType
): Promise<InteractiveRolesType> {
	const newInteractiveRoles: InteractiveRolesType = {
		_id: interactiveRoles._id,
		name: interactiveRoles.name,
		type: interactiveRoles.type,
		guildId,
		channelId: interactiveRoles.channelId,
		messageId: interactiveRoles.messageId,
		embedId: interactiveRoles.embedId,
		placeholder: interactiveRoles.placeholder,
		roles: interactiveRoles.roles.map(role => ({
			_id: role._id,
			icon: role.icon,
			label: role.label,
			description: role.description,
			style: role.style,
			roleId: role.roleId,
			action: role.action,
		})),
	};

	if (newInteractiveRoles.roles.length < 1 || newInteractiveRoles.roles.length > 25)
		throw new Error('Roles amount must be between 1 and 25');

	if (newInteractiveRoles.messageId) {
		await InteractiveRoles.create(newInteractiveRoles);
		const created = await InteractiveRolesModel.findOne({
			guildId,
			channelId: newInteractiveRoles.channelId,
			messageId: newInteractiveRoles.messageId,
		})
			.lean()
			.select('-__v')
			.exec();
		if (!created) throw new Error(`Something went wrong!`);
		return created;
	}

	if (newInteractiveRoles.embedId) {
		const embed = await EmbedModel.findById(newInteractiveRoles.embedId).lean().select('-__v').exec();
		if (!embed || embed.guildId !== guildId) throw new Error('Invalid embedId');
		const newMessage = await Embeds.send(embed);
		const savedEmbed = await EmbedModel.findByIdAndUpdate(
			newInteractiveRoles.embedId,
			{
				messageId: newMessage.id,
			},
			{ new: true, lean: true, upsert: true, runValidators: true, fields: '-__v' }
		);
		if (!savedEmbed) throw new Error('Something went wrong!');

		await InteractiveRoles.create({
			...newInteractiveRoles,
			messageId: newMessage.id,
		});
		const created = await InteractiveRolesModel.findOne({
			guildId,
			channelId: newInteractiveRoles.channelId,
			messageId: newMessage.id,
		})
			.lean()
			.select('-__v')
			.exec();
		if (!created) throw new Error(`Something went wrong!`);
		return created;
	}

	throw new Error('Invalid Interactive Roles');
}

export async function deleteInteractiveRoleService(guildId: Snowflake, interactiveRoleId: string): Promise<boolean> {
	const deletedEmbed = await InteractiveRoles.delete(guildId, interactiveRoleId);
	return deletedEmbed.acknowledged;
}
