import { testGuildId } from 'src/bot';

import type { GuildEmojis } from 'types';

export async function getGlobalEmojisService(): Promise<GuildEmojis> {
	const guild = await client.guilds.fetch(testGuildId);
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
