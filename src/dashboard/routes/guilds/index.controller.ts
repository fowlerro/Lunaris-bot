import { OAuth2Guild } from "discord.js";
import { Request, Response } from "express";
import {
  getBotGuildsService,
  getMutualGuildsService,
  getUserGuildsService,
} from "./index.service";

export async function getGuildsController(req: Request, res: Response) {
  try {
    const botGuilds = await getBotGuildsService();
    const jsonBotGuilds = botGuilds.map(
      (guild) =>
        ({
          ...guild,
          permissions: guild.permissions.toJSON(),
        } as unknown as OAuth2Guild)
    );
    const { data: userGuilds } = await getUserGuildsService(
      req.user!.accessToken
    );
    const mutualGuilds = await getMutualGuildsService(
      jsonBotGuilds,
      userGuilds
    );
    res.send(mutualGuilds);
  } catch (err) {
    logger.error(err);
    res.sendStatus(400);
  }
}
