import { Request, Response } from 'express';
import { AutoRolePageData } from 'types';
import { getAutoRolesService, setAutoRolesService } from '../services/autoRoles.service';

export async function getAutoRolesController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		if (!guildId) return res.sendStatus(400);
		const data = await getAutoRolesService(guildId);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}

export async function setAutoRolesController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		const payload: AutoRolePageData = req.body;
		if (!guildId) return res.sendStatus(400);
		if (!payload) return res.status(400).send('Payload not found');
		const roleIds = new Set();
		const hasDuplicates = payload.autoRoles.some(autoRole => roleIds.size === roleIds.add(autoRole.roleId).size);
		if (hasDuplicates) return res.status(400).send('Duplicate roles are not allowed');

		await setAutoRolesService(guildId, payload);

		return res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}
