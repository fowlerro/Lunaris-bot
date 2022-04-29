import { Message, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { HydratedDocument } from 'mongoose';

import type { InteractiveRolesType } from 'types';

export default function createReactionRoleSelect(
	interactiveRoles: HydratedDocument<InteractiveRolesType>,
	message: Message
) {
	if (!message.editable) throw new Error('Cannot edit message');
	const selectMenu = new MessageSelectMenu({
		customId: `IR-${interactiveRoles._id}`,
		minValues: 0,
		maxValues: interactiveRoles.roles.length,
		placeholder: interactiveRoles.placeholder,
		options: interactiveRoles.roles.map(item => ({
			label: item.label!,
			description: item.description,
			value: item._id!.toString(),
			emoji: item.icon,
		})),
	});

	const actionRow = new MessageActionRow({
		components: [selectMenu],
	});

	message.edit({
		components: [actionRow],
	});
}
