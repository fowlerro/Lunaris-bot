import { Snowflake } from 'discord.js';

import InteractiveRoles from '@modules/InteractiveRoles';

import type { InteractiveRolesType } from 'types';

export async function getInteractiveRolesService(guildId: Snowflake): Promise<InteractiveRolesType[]> {
	const interactiveRolesList = await InteractiveRoles.list(guildId);
	if (!interactiveRolesList) throw new Error('Interactive Roles not found');

	return interactiveRolesList;
}
