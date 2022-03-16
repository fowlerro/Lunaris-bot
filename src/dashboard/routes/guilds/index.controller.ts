import { OAuth2Guild } from 'discord.js';
import { Request, Response } from 'express';
import {
	getBotGuildsService,
	getGuildBansService,
	getGuildPermissionsService,
	getGuildStatisticsService,
	getGuildWarnsService,
	getMutualGuildsService,
	getUserGuildsService,
} from './index.service';

export async function getGuildsController(req: Request, res: Response) {
	try {
		const botGuilds = await getBotGuildsService();
		const jsonBotGuilds = botGuilds.map(
			guild =>
				({
					...guild,
					permissions: guild.permissions.toJSON(),
				} as unknown as OAuth2Guild)
		);
		const { data: userGuilds } = await getUserGuildsService(req.user!.accessToken);
		const mutualGuilds = await getMutualGuildsService(jsonBotGuilds, userGuilds);
		res.send(mutualGuilds);
	} catch (err) {
		logger.error(err);
		res.sendStatus(400);
	}
}

export async function getGuildPermissionsController(req: Request, res: Response) {
	try {
		const userId = req.user?.discordId;
		if (!userId) return res.sendStatus(403);
		const { guildId } = req.params;
		const hasPermission = await getGuildPermissionsService(userId, guildId);
		return hasPermission ? res.sendStatus(200) : res.sendStatus(403);
	} catch (err) {
		logger.error(err);
		res.sendStatus(403);
	}
}

export async function getGuildStatisticsController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		if (!guildId) return res.sendStatus(500);
		const data = await getGuildStatisticsService(guildId);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}

export async function getGuildBansController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		if (!guildId) return res.sendStatus(500);
		const data = await getGuildBansService(guildId);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}

export async function getGuildWarnsController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		if (!guildId) return res.sendStatus(500);
		const data = await getGuildWarnsService(guildId);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}
