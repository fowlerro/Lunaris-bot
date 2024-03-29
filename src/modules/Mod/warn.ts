import { Snowflake } from 'discord.js';
import mongoose, { HydratedDocument } from 'mongoose';

import Logs from '../Logs';
import Profiles from '../Profiles';
import { GuildProfile, GuildProfileModel } from '../../database/schemas/GuildProfile';
import { getLocale } from '../../utils/utils';

import type { GuildProfileWarn } from 'types';

export const Warn = {
	give: async (guildId: Snowflake, targetId: Snowflake, executorId: Snowflake, reason?: string) => {
		const guild = await client.guilds.fetch(guildId).catch(logger.error);
		if (!guild) return;
		const language = getLocale(guild.preferredLocale);
		const target = await guild.members.fetch(targetId).catch(logger.error);
		if (!target) return;

		const guildProfile = await Profiles.get(targetId, guildId);
		if (!guildProfile) return;
		guildProfile.warns.push({
			_id: new mongoose.Types.ObjectId() as unknown as string,
			executorId,
			reason: reason || null,
			date: Date.now(),
		});

		const document = await GuildProfileModel.findOneAndReplace({ guildId, userId: targetId }, guildProfile, {
			new: true,
			runValidators: true,
			lean: true,
			fields: '-_id -__v',
		})
			.select('-_id -__v')
			.catch(logger.error);
		if (!document) return;

		Profiles.set(document);
		await Logs.log('members', 'warn', guildId, {
			member: target,
			customs: {
				moderatorMention: `<@${executorId}>`,
				moderatorId: executorId,
				memberWarnCount: document.warns.length,
				reason: reason || t('general.none', language),
			},
		});

		return true;
	},
	remove: async (
		guildId: Snowflake,
		warnId: string,
		executorId: Snowflake,
		targetId?: Snowflake,
		reason?: string
	): Promise<{
		action?: 'all' | 'targetAll';
		error?: 'warnNotFound' | 'targetNotFound' | 'guildNotFound' | 'targetWithoutWarns' | 'error';
		result?: GuildProfile;
	}> => {
		const guild = await client.guilds.fetch(guildId).catch(logger.error);
		if (!guild) return { error: 'guildNotFound' };
		const language = getLocale(guild.preferredLocale);
		if (warnId === 'all') {
			const { warns } = await list(guildId);
			if (!warns.length) return { error: 'error' };

			warns.forEach(async document => {
				const cachedProfile = cache.guildProfiles.get<GuildProfile>(`${guildId}-${document.userId}`);
				if (!cachedProfile) {
					document.warns = [];
					await document.save().catch(logger.error);
					return;
				}
				cachedProfile.warns = [];
				const res = await document.replaceOne(cachedProfile).exec().catch(logger.error);
				if (res) Profiles.set(cachedProfile);
			});

			Logs.log('server', 'unwarnAll', guildId, {
				customs: {
					mentionModerator: `<@${executorId}>`,
					moderatorId: executorId,
					reason: reason || t('general.none', language),
				},
			});
			return { action: 'all' };
		}

		if (warnId === 'targetAll' && targetId) {
			const target = await guild.members.fetch(targetId).catch(logger.error);
			if (!target) return { error: 'targetNotFound' };

			const profile = await Profiles.get(targetId, guildId);
			if (!profile) return { error: 'error' };
			if (!profile.warns.length) return { error: 'targetWithoutWarns' };

			profile.warns = [];
			const res = await GuildProfileModel.findOneAndReplace({ guildId, userId: targetId }, profile)
				.exec()
				.catch(logger.error);
			if (!res) return { error: 'error' };

			Profiles.set(profile);
			await Logs.log('members', 'unwarnAll', guildId, {
				member: target,
				customs: {
					moderatorMention: `<@${executorId}>`,
					moderatorId: executorId,
					memberUnwarnCount: profile.warns.length || '0',
					reason: reason || t('general.none', language),
				},
			});

			return { action: 'targetAll' };
		}

		if (!targetId) return { error: 'targetNotFound' };

		const target = await guild.members.fetch(targetId).catch(logger.error);
		if (!target) return { error: 'targetNotFound' };

		const document = await GuildProfileModel.findOne({ guildId, 'warns._id': warnId }).exec().catch(logger.error);
		if (!document) return { error: 'warnNotFound' };

		const cachedProfile = cache.guildProfiles.get<GuildProfile>(`${guildId}-${document.userId}`);
		if (!cachedProfile) document.updateOne({ $pull: { warns: { _id: warnId } } }).catch(logger.error);
		if (cachedProfile) {
			cachedProfile.warns.filter(warn => warn._id.toString() !== warnId);
			const res = await document.replaceOne(cachedProfile).catch(logger.error);
			if (!res) return { error: 'error' };
		}

		// @ts-ignore
		const { _id, __v, ...profile } = document.toObject();

		Profiles.set(profile);
		await Logs.log('members', 'unwarn', guildId, {
			member: target,
			customs: {
				moderatorMention: `<@${executorId}>`,
				moderatorId: executorId,
				memberWarnCount: document.warns.length || '0',
				reason: reason || t('general.none', language),
			},
		});

		return { result: document };
	},
	list,
};

async function list(guildId: Snowflake): Promise<{ warns: HydratedDocument<GuildProfile>[]; error?: string }>;
async function list(guildId: Snowflake, targetId: Snowflake): Promise<{ warns: GuildProfileWarn[]; error?: string }>;
async function list(
	guildId: Snowflake,
	targetId?: Snowflake
): Promise<{ warns: GuildProfileWarn[] | HydratedDocument<GuildProfile>[]; error?: string }>;
async function list(
	guildId: Snowflake,
	targetId?: Snowflake
): Promise<{ warns: GuildProfileWarn[] | HydratedDocument<GuildProfile>[]; error?: string }> {
	if (targetId) {
		const result = await GuildProfileModel.findOne({ guildId, userId: targetId }).catch(logger.error);
		if (!result) return { error: 'profileNotFound', warns: [] };
		if (!result?.warns.length) return { warns: [] };
		return { warns: result.warns };
	}

	let warns = await GuildProfileModel.find({ guildId }).select(['-muted', '-__v']).exec().catch(logger.error);
	if (!warns) return { error: 'profileNotFound', warns: [] };
	warns = warns.filter(v => v.warns.length > 0);
	if (!warns.map(v => v.warns.length).reduce((a, b) => a + b, 0)) return { warns: [] };

	return { warns };
}
