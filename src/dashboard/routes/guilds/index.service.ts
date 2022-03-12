import axios from "axios";
import { OAuth2Guild } from "discord.js";
import CryptoJS from "crypto-js";
import { DISCORD_API_URL } from "../../utils/constants";
import { decrypt } from "../../utils/utils";

export async function getBotGuildsService() {
  return client.guilds.fetch();
}

export async function getUserGuildsService(encryptedAccessToken: string) {
  const decrypted = decrypt(encryptedAccessToken);
  const accessToken = decrypted.toString(CryptoJS.enc.Utf8);
  return axios.get<OAuth2Guild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getMutualGuildsService(
  botGuilds: OAuth2Guild[],
  userGuilds: OAuth2Guild[]
) {
  const validGuilds = userGuilds.filter(
    (guild) =>
      (parseInt(guild.permissions as unknown as string) & 0x20) === 0x20
  );
  const included: OAuth2Guild[] = [];
  const excluded = validGuilds.filter((userGuild) => {
    const findGuild = botGuilds.find(
      (botGuild) => botGuild.id === userGuild.id
    );
    if (!findGuild) return userGuild;
    included.push(findGuild);
  });

  return { excluded, included };
}
