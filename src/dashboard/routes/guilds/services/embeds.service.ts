import { Snowflake } from 'discord.js';

import Embeds from '../../../../modules/Embeds';

import type { EmbedMessage } from 'types';

export async function getEmbedMessagesService(guildId: Snowflake): Promise<EmbedMessage[]> {
	const guildEmbedMessages = await Embeds.get(guildId);

	return guildEmbedMessages;
}

export async function saveEmbedMessageService(
	guildId: Snowflake,
	embedMessage: EmbedMessage,
	withoutSending: boolean
): Promise<EmbedMessage> {
	const fields = embedMessage.embed?.fields
		? embedMessage.embed?.fields.map(field => ({
				name: field.name,
				value: field.value,
				inline: field.inline,
		  }))
		: [];

	const savedEmbed = await Embeds.save(
		{
			_id: embedMessage._id,
			name: embedMessage.name,
			guildId: guildId,
			channelId: embedMessage.channelId,
			messageId: embedMessage.messageId,
			messageContent: embedMessage.messageContent,
			embed: {
				author: {
					name: embedMessage.embed?.author?.name,
					url: embedMessage.embed?.author?.url,
					iconURL: embedMessage.embed?.author?.iconURL,
				},
				hexColor: embedMessage.embed?.hexColor,
				description: embedMessage.embed?.description,
				footer: {
					text: embedMessage.embed?.footer?.text,
					iconURL: embedMessage.embed?.footer?.iconURL,
				},
				image: {
					url: embedMessage.embed?.image?.url,
					width: embedMessage.embed?.image?.width,
					height: embedMessage.embed?.image?.height,
				},
				thumbnail: {
					url: embedMessage.embed?.thumbnail?.url,
					width: embedMessage.embed?.thumbnail?.width,
					height: embedMessage.embed?.thumbnail?.height,
				},
				timestamp: embedMessage.embed?.timestamp,
				title: embedMessage.embed?.title,
				url: embedMessage.embed?.url,
				fields,
			},
		},
		withoutSending
	);

	return savedEmbed;
}

export async function deleteEmbedMessageService(guildId: Snowflake, embedId: Snowflake): Promise<boolean> {
	const deletedEmbed = await Embeds.delete(guildId, embedId);
	return deletedEmbed;
}
