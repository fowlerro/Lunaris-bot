import { Snowflake } from 'discord.js';

import Guilds from '../../../../modules/Guilds';
import autoRole from '../../../../modules/autoRole';

import { AutoRoleConfig, AutoRolePageData } from 'types';

export async function getAutoRolesService(guildId: Snowflake): Promise<AutoRolePageData> {
	const guildConfig = await Guilds.config.get(guildId);
	if (!guildConfig) throw new Error('Guild config not found');

	const autoRoleConfig = await autoRole.get(guildId);
	if (!autoRoleConfig) throw new Error('AutoRole config not found');

	return {
		status: guildConfig.modules.autoRole,
		autoRoles: autoRoleConfig.roles,
	};
}

export async function setAutoRolesService(guildId: Snowflake, payload: AutoRolePageData): Promise<AutoRolePageData> {
	const { status, autoRoles } = payload;
	const guildConfig = await Guilds.config.get(guildId);
	const guild = await client.guilds.fetch(guildId);
	for await (const autoRole of autoRoles) {
		if (!autoRole.roleId) throw new Error('Invalid roleId');
		const role = await guild.roles.fetch(autoRole.roleId);
		if (!role) throw new Error('Invalid roleId');
	}

	if (guildConfig?.modules.autoRole !== status) {
		const updatedGuildConfig = await Guilds.config.set(guildId, { 'modules.autoRole': status });
		if (!updatedGuildConfig) throw new Error("Couldn't update guild config");
	}

	const autoRolesConfig: AutoRoleConfig = {
		guildId,
		roles: autoRoles.map(autoRole => ({ roleId: autoRole.roleId, time: autoRole.time })),
	};

	const updatedAutoRoles = await autoRole.set(autoRolesConfig);
	if (!updatedAutoRoles) throw new Error("Couldn't update auto roles");

	return {
		status,
		autoRoles,
	};
}
