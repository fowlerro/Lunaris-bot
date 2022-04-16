import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { HydratedDocument } from 'mongoose';

import InteractiveRoles, { INTERACTIVE_ROLE_STYLES } from '.';

import type { InteractiveRolesType } from 'types';

export default function createReactionRoleButtons(
	interactiveRoles: HydratedDocument<InteractiveRolesType>,
	message: Message
) {
	if (!message.editable) throw new Error('Cannot edit message');
	const buttons: MessageButton[] = interactiveRoles.roles.map(role => {
		return new MessageButton({
			customId: `IR-${interactiveRoles._id}-${role._id}`,
			style: role.style ?? INTERACTIVE_ROLE_STYLES[0],
			label: role.label,
			emoji: role.icon,
		});
	});

	if (buttons.length > 25) throw new Error('Cannot have more than 25 buttons');

	const actionRows = buttons.reduce((rows, button) => {
		const lastRow: MessageActionRow = rows[rows.length - 1];
		if (!lastRow) return [new MessageActionRow({ components: [button] })];
		if (lastRow.components.length < 5) {
			lastRow.addComponents(button);
			return rows;
		}
		const newRow = new MessageActionRow({ components: [button] });
		return [...rows, newRow];
	}, [] as MessageActionRow[]);

	if (actionRows.length > 5) throw new Error('Cannot have more than 5 button rows');

	message.edit({
		components: actionRows,
	});
}
