import { Request, Response } from 'express';

import {
	deleteInteractiveRoleService,
	getInteractiveRolesService,
	saveInteractiveRolesService,
} from '../services/interactiveRoles.service';

export async function getInteractiveRolesController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;

		const data = await getInteractiveRolesService(guildId);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}

export async function saveInteractiveRolesController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		const interactiveRoles = req.body;

		const data = await saveInteractiveRolesService(guildId, interactiveRoles);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}

export async function deleteInteractiveRoleController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		const interactiveRoleId = req.body.interactiveRoleId as string;

		const isDeleted = await deleteInteractiveRoleService(guildId, interactiveRoleId);
		return isDeleted ? res.sendStatus(200) : res.sendStatus(500);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}
