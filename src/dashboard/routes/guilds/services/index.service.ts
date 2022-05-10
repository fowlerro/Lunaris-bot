import { CategoryChannel, OAuth2Guild, Snowflake, TextChannel } from 'discord.js';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import Guilds from '@modules/Guilds';
import autoRole from '@modules/autoRole';
import Levels from '@modules/Levels';

import { GuildBanModel } from '@schemas/GuildBans';
import { GuildProfileModel } from '@schemas/GuildProfile';
import { InteractiveRolesModel } from '@schemas/InteractiveRoles';
import { EmbedModel } from '@schemas/Embed';

import { DISCORD_API_URL } from '../../../utils/constants';
import { decrypt } from '../../../utils/utils';

import type {
	GuildStats,
	Ban,
	APIBan,
	WarnedUser,
	Role,
	discordjsRole,
	GuildChannels,
	GuildInfo,
	GuildEmojis,
	GuildOverviewModules,
} from 'types';

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
		included.push(userGuild);
	});

	return { excluded, included };
}

export async function getGuildService(guildId: Snowflake): Promise<GuildInfo | null> {
	const guild = await client.guilds.fetch(guildId);
	if (!guild.available) return null;

	return {
		id: guild.id,
		name: guild.name,
		description: guild.description,
		acronym: guild.nameAcronym,
		icon: guild.icon,
		banner: guild.banner,
		createdAt: guild.createdAt,
		createdTimestamp: guild.createdTimestamp,
		ownerId: guild.ownerId,
	};
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
	const bans = await guild.bans.fetch();
	const banCount = bans.size;
	const channels = await guild.channels.fetch();
	const textChannelCount = channels.filter(channel => channel.isText()).size;
	const voiceChannelCount = channels.filter(channel => channel.isVoice()).size;
	const roles = await guild.roles.fetch();
	const roleCount = roles.size;
	const emojis = await guild.emojis.fetch();
	const emojiCount = emojis.size;
	const data = {
		members: memberCount,
		bots: botCount,
		bans: banCount,
		channels: textChannelCount,
		voiceChannels: voiceChannelCount,
		roles: roleCount,
		emojis: emojiCount,
	};

	return data;
}

export async function getGuildModulesService(guildId: Snowflake): Promise<GuildOverviewModules> {
	const guildConfig = await Guilds.config.get(guildId);
	if (!guildConfig) throw new Error('Guild Config not found');

	const autoRoles = await autoRole.get(guildId);
	const autoRoleCount = autoRoles?.roles?.length ?? 0;

	const levelConfig = await Levels.get(guildId);
	const levelText = levelConfig?.rewards?.text?.length ?? 0;
	const levelVoice = levelConfig?.rewards?.voice?.length ?? 0;

	const interactiveRolesCount = await InteractiveRolesModel.countDocuments({ guildId });
	const embedCount = await EmbedModel.countDocuments({ guildId });

	return {
		autoRoles: {
			status: guildConfig.modules.autoRole,
			amount: autoRoleCount,
		},
		levels: {
			status: guildConfig.modules.levels,
			text: {
				amount: levelText,
			},
			voice: {
				amount: levelVoice,
			},
		},
		interactiveRoles: {
			amount: interactiveRolesCount,
		},
		embeds: {
			amount: embedCount,
		},
		serverLogs: {
			status: guildConfig.modules.serverLogs,
		},
	};
}

export async function getGuildEmojisService(guildId: Snowflake): Promise<GuildEmojis> {
	const guild = await client.guilds.fetch(guildId);
	const emojis = await guild.emojis.fetch();

	return {
		name: guild.name,
		iconURL: guild.iconURL({ dynamic: true }) ?? undefined,
		emojis: emojis
			.filter(emoji => Boolean(emoji.name))
			.map(emoji => ({
				id: emoji.id,
				name: emoji.name!,
				animated: emoji.animated ?? false,
			})),
	};
}

export async function getRolesService(guildId: Snowflake): Promise<discordjsRole[]> {
	const guild = await client.guilds.fetch(guildId);
	const data = await guild.roles.fetch();

	return data.filter(role => role.name !== '@everyone' && !role.tags?.botId && role.editable).toJSON();
}

export async function getChannelsService(guildId: Snowflake): Promise<GuildChannels> {
	const guild = await client.guilds.fetch(guildId);
	const guildChannels = await guild.channels.fetch();
	const guildTextChannels = guildChannels.filter(guild => guild.isText()).toJSON() as TextChannel[];
	const guildCategoryChannels = guildChannels
		.filter(guild => guild.type === 'GUILD_CATEGORY')
		.toJSON() as CategoryChannel[];

	return {
		text: guildTextChannels,
		category: guildCategoryChannels,
	};
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
