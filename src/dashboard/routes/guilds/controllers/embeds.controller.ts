import { Request, Response } from 'express';

import {
	deleteEmbedMessageService,
	getEmbedMessagesService,
	saveEmbedMessageService,
} from '../services/embeds.service';

import type { EmbedMessage } from 'types';

export async function getEmbedMessagesController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;

		const data = await getEmbedMessagesService(guildId);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}

export async function saveEmbedMessageController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		const { embedMessage, withoutSending } = req.body as { embedMessage: EmbedMessage; withoutSending: boolean };

		const data = await saveEmbedMessageService(guildId, embedMessage, withoutSending);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}

export async function deleteEmbedMessageController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		const embedId = req.body.embedId as string;

		const isDeleted = await deleteEmbedMessageService(guildId, embedId);
		return isDeleted ? res.sendStatus(200) : res.sendStatus(500);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}
