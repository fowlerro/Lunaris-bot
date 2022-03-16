import { OAuth2Guild, Snowflake } from 'discord.js';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import { GuildBanModel } from '../../../database/schemas/GuildBans';
import { GuildProfileModel } from '../../../database/schemas/GuildProfile';

import { DISCORD_API_URL } from '../../utils/constants';
import { decrypt } from '../../utils/utils';

import type { GuildStats, Ban, APIBan, WarnedUser } from 'types';

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

export async function getMutualGuildsService(botGuilds: OAuth2Guild[], userGuilds: OAuth2Guild[]) {
	const validGuilds = userGuilds.filter(guild => (parseInt(guild.permissions as unknown as string) & 0x20) === 0x20);
	const included: OAuth2Guild[] = [];
	const excluded = validGuilds.filter(userGuild => {
		const findGuild = botGuilds.find(botGuild => botGuild.id === userGuild.id);
		if (!findGuild) return userGuild;
		included.push(findGuild);
	});

	return { excluded, included };
}

export async function getGuildPermissionsService(userId: Snowflake, guildId: Snowflake) {
	const guild = await client.guilds.fetch(guildId);
	const guildMember = await guild.members.fetch(userId);
	const hasPermission = guildMember.permissions.has('MANAGE_GUILD');
	return hasPermission;
}

export async function getGuildStatisticsService(guildId: Snowflake): Promise<GuildStats> {
	const guild = await client.guilds.fetch(guildId);
	const members = await guild.members.fetch();
	const botCount = members.filter(member => member.user.bot).size;
	const memberCount = guild.memberCount - botCount;
	const channels = await guild.channels.fetch();
	const textChannelCount = channels.filter(channel => channel.isText()).size;
	const voiceChannelCount = channels.filter(channel => channel.isVoice()).size;
	const data = {
		name: guild.name,
		icon: {
			hash: guild.icon,
			acronym: guild.nameAcronym,
		},
		stats: {
			members: memberCount,
			bots: botCount,
			channels: textChannelCount,
			voiceChannels: voiceChannelCount,
		},
	};

	return data;
}

export async function getGuildBansService(guildId: Snowflake): Promise<Ban[]> {
	const { data } = await axios.get<APIBan[]>(`${DISCORD_API_URL}/guilds/${guildId}/bans`, {
		headers: {
			Authorization: `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
		},
	});

	const timedBans = await GuildBanModel.find({ guildId }).select('-_id -__v').lean().exec();

	const bans: Ban[] = await Promise.all(
		data.map(async ban => {
			const timedBan = timedBans.find(tBan => tBan.userId === ban.user.id);
			if (!timedBan) return { ...ban };

			const executor = await client.users.fetch(timedBan.executorId);
			return {
				...ban,
				executor: {
					id: executor.id,
					username: executor.username,
					avatar: executor.avatar || undefined,
					discriminator: executor.discriminator,
				},
				time: timedBan.time,
			};
		})
	);

	return bans;
}

export async function getGuildWarnsService(guildId: Snowflake): Promise<WarnedUser[]> {
	const guildProfiles = await GuildProfileModel.find({ guildId, warns: { $exists: true, $not: { $size: 0 } } })
		.select('userId warns')
		.lean()
		.exec();

	let warns: WarnedUser[] = [];

	for await (const profile of guildProfiles) {
		const user = await client.users.fetch(profile.userId).catch(logger.error);
		if (!user) continue;

		let profileWarns: WarnedUser['warns'] = [];
		for await (const warn of profile.warns) {
			const executor = await client.users.fetch(warn.executorId).catch(logger.error);
			if (!executor) continue;

			profileWarns.push({
				_id: warn._id,
				date: warn.date,
				reason: warn.reason,
				executor: {
					id: executor.id,
					username: executor.username,
					discriminator: executor.discriminator,
					avatar: executor.avatar || undefined,
				},
			});
		}

		warns.push({
			user: {
				id: user.id,
				username: user.username,
				discriminator: user.discriminator,
				avatar: user.avatar || undefined,
			},
			warns: profileWarns,
		});
	}

	return warns;
}
