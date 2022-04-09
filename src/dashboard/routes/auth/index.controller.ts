import { Request, Response } from 'express';

import { getAuthService } from './index.service';

import { User } from 'types';

export async function getAuthController(req: Request, res: Response) {
	try {
		const { data } = await getAuthService(req.user!.accessToken);
		const user: User = {
			discordId: data.id,
			discordTag: `${data.username}#${data.discriminator as unknown as number}`,
			avatar: data.avatar,
			banner: data.banner ?? null,
		};
		user ? res.send(user) : res.status(401).send('Unauthorized');
	} catch (err) {
		logger.error(err);
		res.sendStatus(400);
	}
}
