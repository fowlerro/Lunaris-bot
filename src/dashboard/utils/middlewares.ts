import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) =>
	req.user ? next() : res.sendStatus(403);

export const isAuthorizedInGuild = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user?.discordId;
	const { guildId } = req.params;
	if (!guildId || !userId) return res.sendStatus(403);
	const guild = await client.guilds.fetch(guildId);
	const guildMember = await guild.members.fetch(userId);
	const hasPermission = guildMember.permissions.has('MANAGE_GUILD');
	hasPermission ? next() : res.sendStatus(403);
};

export const checkValidationErrors = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).json({ errors: errors.formatWith(({ msg, param }) => `[${param}]: ${msg}`) });
	next();
};
