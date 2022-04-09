import { Snowflake } from 'discord.js';

import Profiles from '../../../modules/Profiles';

import type { ProfileWithRank } from 'types';

export async function getProfileService(discordId: Snowflake): Promise<ProfileWithRank | null> {
	const profile = await Profiles.get(discordId);
	if (!profile) return null;

	const textXpNeeded = await Profiles.neededXp(profile.statistics.text.level);
	const voiceXpNeeded = await Profiles.neededXp(profile.statistics.voice.level);
	const textRank = await Profiles.getRank('text', profile.userId);
	const voiceRank = await Profiles.getRank('voice', profile.userId);
	if (!textRank || !voiceRank) return null;

	return {
		...profile,
		xpNeeded: {
			text: textXpNeeded,
			voice: voiceXpNeeded,
		},
		rank: {
			text: textRank,
			voice: voiceRank,
		},
	};
}
