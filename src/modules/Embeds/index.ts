import {
	ButtonInteraction,
	CommandInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
	MessageEmbed,
	MessageSelectMenu,
	SelectMenuInteraction,
	TextChannel,
	Snowflake,
} from 'discord.js';

import BaseModule from '../../utils/structures/BaseModule';
import { EmbedModel } from '../../database/schemas/Embed';
import { EMBED_LIMITS } from '../../utils/utils';
import type { Embed, EmbedMessage } from 'types';

class EmbedsModule extends BaseModule {
	constructor() {
		super('Embeds', true);
	}

	async run() {}

	async get(guildId: Snowflake): Promise<EmbedMessage[]>;
	async get(guildId: Snowflake, embedId: string): Promise<EmbedMessage>;
	async get(guildId: Snowflake, embedId?: unknown): Promise<unknown> {
		const guildEmbeds = embedId
			? await EmbedModel.findOne({ guildId, _id: embedId }).lean().exec()
			: await EmbedModel.find({ guildId }).lean().exec();
		if (!guildEmbeds) throw new Error('Embed not found');
		return guildEmbeds;
	}

	async save(embed: EmbedMessage, withoutSending?: boolean): Promise<EmbedMessage> {
		const guildEmbedCount = await EmbedModel.countDocuments({ guildId: embed.guildId }).exec();
		if (guildEmbedCount >= 15) throw new Error('You can only have 15 embeds per guild.');

		if (embed.channelId && !withoutSending) {
			const msg = await this.send(embed);
			embed.messageId = msg.id;
		}

		if (embed._id)
			return EmbedModel.findByIdAndUpdate(embed._id, embed, {
				new: true,
				upsert: true,
				runValidators: true,
				lean: true,
			}).exec();

		const newEmbed = await EmbedModel.create(embed);
		const leanEmbed = newEmbed.toObject();
		return leanEmbed;
	}

	async delete(guildId: string, embedId: string): Promise<boolean> {
		const embedToDelete = await EmbedModel.findOne({ guildId, _id: embedId }).exec();
		if (!embedToDelete) return false;
		embedToDelete.remove();
		return true;
	}

	async send(embedMessage: EmbedMessage) {
		if (!embedMessage.channelId) throw new Error('Channel not found');
		const guild = await client.guilds.fetch(embedMessage.guildId).catch(logger.error);
		if (!guild) throw new Error('Guild not found');
		const channel = await guild.channels.fetch(embedMessage.channelId).catch(logger.error);
		if (!channel) throw new Error('Channel not found');
		if (!channel.isText()) throw new Error('Channel is not a text channel');
		if (embedMessage.messageId) {
			const message = await channel.messages.fetch(embedMessage.messageId).catch(logger.error);
			if (message) return this.edit(message, embedMessage.messageContent, embedMessage.embed);
		}

		if (embedMessage.embed.hexColor) embedMessage.embed.color = parseInt(embedMessage.embed.hexColor.substring(1), 16);

		const e = new MessageEmbed(embedMessage.embed as unknown as MessageEmbed);

		const { pages, error } = this.checkLimits(e, true);
		if (error) throw new Error(error);

		return this.pageEmbeds(embedMessage.messageContent, pages, embedMessage.guildId, embedMessage.channelId, 1, true);
	}
	async edit(message: Message, messageContent: string | undefined, embed: Embed) {
		if (!message) throw new Error('Message not found');

		if (embed.hexColor) embed.color = parseInt(embed.hexColor.substring(1), 16);
		const e = new MessageEmbed(embed as unknown as MessageEmbed);
		const { pages, error } = this.checkLimits(e, false);
		if (error) throw new Error(error);
		return message.edit({ content: messageContent || undefined, embeds: [pages[0]] });
	}
	checkLimits(embed: MessageEmbed, pageEmbed = true, maxFields = 25): { error: string | null; pages: MessageEmbed[] } {
		checkTitle(embed);
		checkAuthor(embed);
		checkDescription(embed);
		checkFooter(embed);

		const pages: MessageEmbed[] = checkFields(embed, maxFields)
			? pageEmbed
				? divideFields(embed, maxFields)
				: [embed]
			: [embed];
		if (checkPagesTotalLimit(pages)) return { error: '6000', pages: [] };

		return {
			error: null,
			pages,
		};
	}
	async pageEmbeds(
		messageContent: string | undefined,
		embeds: MessageEmbed[],
		guildId: Snowflake,
		channelId: Snowflake,
		defaultPage = 1,
		buttons = true,
		selectMenu = false
	) {
		const guild = await client.guilds.fetch(guildId).catch(logger.error);
		if (!guild) throw new Error('Guild not found');
		const channel = await (guild.channels.fetch(channelId) as Promise<TextChannel>).catch(logger.error);
		if (!channel) throw new Error('Channel not found');

		if (embeds.length === 1) return channel.send({ content: messageContent || undefined, embeds: [embeds[0]] });

		const components = [];
		selectMenu && components.push(addSelectMenu(embeds, defaultPage));
		buttons && components.push(addButtons(embeds, defaultPage));

		const message = await channel
			.send({ content: messageContent || undefined, embeds: [embeds[defaultPage] || embeds[0]], components })
			.catch(logger.error);
		if (!message) throw new Error('Message not sent');
		createCollectors(message, embeds);

		return message;
	}

	// TODO Ephemeral on errors
	async pageInteractionEmbeds(
		messageContent: string | null,
		embeds: MessageEmbed[],
		interaction: CommandInteraction,
		defaultPage = 1,
		buttons = true,
		selectMenu = false
	) {
		if (embeds.length === 1)
			return interaction.reply({ content: messageContent, embeds: [embeds[0]] }).catch(logger.error);

		defaultPage = defaultPage > embeds.length - 1 ? embeds.length - 1 : defaultPage > 0 ? defaultPage : 1;

		const components = [];
		selectMenu && components.push(addSelectMenu(embeds, defaultPage));
		buttons && components.push(addButtons(embeds, defaultPage));

		await interaction
			.reply({ content: messageContent || undefined, embeds: [embeds[defaultPage] || embeds[0]], components })
			.catch(logger.error);

		const fetchedReply = await interaction.fetchReply().catch(logger.error);
		if (!fetchedReply || !('applicationId' in fetchedReply)) return new Error('Reply not fetched');

		createCollectors(fetchedReply, embeds);

		return fetchedReply;
	}
}

function checkTitle(embed: MessageEmbed) {
	if (embed.title && embed.title.length > EMBED_LIMITS.title)
		embed.setTitle(embed.title.slice(0, EMBED_LIMITS.title - 3) + '...');
}

function checkAuthor(embed: MessageEmbed) {
	if (embed.author?.name && embed.author.name.length > EMBED_LIMITS.author)
		embed.setAuthor({
			name: embed.author.name.slice(0, EMBED_LIMITS.author - 3) + '...',
			iconURL: embed.author.iconURL,
			url: embed.author.url,
		});
}

function checkDescription(embed: MessageEmbed) {
	if (embed.description && embed.description.length > EMBED_LIMITS.description)
		embed.setDescription(embed.description.slice(0, EMBED_LIMITS.description - 3) + '...');
}

function checkFooter(embed: MessageEmbed) {
	if (embed.footer?.text && embed.footer.text.length > EMBED_LIMITS.footer)
		embed.setFooter({
			text: embed.footer.text.slice(0, EMBED_LIMITS.footer - 3) + '...',
			iconURL: embed.footer.iconURL,
		});
}

function checkFields(embed: MessageEmbed, maxFields: number) {
	embed.fields.forEach(field => {
		if (field.name.length > EMBED_LIMITS.field.name)
			field.name = field.name.slice(0, EMBED_LIMITS.field.name - 3) + '...';

		if (field.value.length > EMBED_LIMITS.field.value)
			field.value = field.value.slice(0, EMBED_LIMITS.field.value - 3) + '...';
	});

	if (embed.fields.length <= (maxFields || EMBED_LIMITS.field.amount)) return false;
	return true;
}

function divideFields(embed: MessageEmbed, maxFields: number) {
	const fieldsAmount = embed.fields.length;
	const pageAmount = Math.ceil(fieldsAmount / (maxFields || EMBED_LIMITS.field.amount));

	const embeds = [embed];

	for (let i = 0; i < pageAmount; i++) {
		const e = new MessageEmbed();

		e.author = embed.author;
		e.title = embed.title;
		e.color = embed.color;
		e.description = embed.description;
		e.footer = embed.footer;
		e.image = embed.image;
		e.thumbnail = embed.thumbnail;
		e.url = embed.url;
		e.fields = embed.fields;
		e.fields = e.fields.slice(
			i * (maxFields || EMBED_LIMITS.field.amount),
			(i + 1) * (maxFields || EMBED_LIMITS.field.amount)
		);

		embeds.push(e);
	}

	return embeds;
}

function checkPagesTotalLimit(pages: MessageEmbed[]) {
	return pages.reduce((prev, curr, index) => {
		return index === 0 ? false : prev ? true : pages[index].length > 6000;
	}, false);
}

function addButtons(pages: MessageEmbed[], defaultPage: number) {
	const firstPageButton = new MessageButton()
		.setStyle('PRIMARY')
		.setEmoji('⏮')
		.setCustomId('firstPage')
		.setDisabled(defaultPage === 1);

	const previousPageButton = new MessageButton()
		.setStyle('PRIMARY')
		.setEmoji('◀')
		.setCustomId('previousPage')
		.setDisabled(defaultPage === 1);

	const nextPageButton = new MessageButton()
		.setStyle('PRIMARY')
		.setEmoji('▶')
		.setCustomId('nextPage')
		.setDisabled(defaultPage === pages.length - 1);

	const lastPageButton = new MessageButton()
		.setStyle('PRIMARY')
		.setEmoji('⏭')
		.setCustomId('lastPage')
		.setDisabled(defaultPage === pages.length - 1);

	const pageInfoButton = new MessageButton()
		.setStyle('PRIMARY')
		.setLabel(`${defaultPage}/${pages.length - 1}`)
		.setCustomId('pageInfo')
		.setDisabled();

	return new MessageActionRow().addComponents([
		firstPageButton,
		previousPageButton,
		pageInfoButton,
		nextPageButton,
		lastPageButton,
	]);
}

function addSelectMenu(pages: MessageEmbed[], defaultPage: number) {
	const options = [];
	for (let i = 1; i < pages.length; i++) {
		options.push({
			label: `Page ${i}`,
			value: `page${i}`,
			default: i === defaultPage,
		});
	}

	const selectMenu = new MessageSelectMenu().setCustomId('pageSelectMenu').addOptions(options);

	return new MessageActionRow().addComponents([selectMenu]);
}

async function createCollectors(message: Message, pages: MessageEmbed[]) {
	const buttons = message.components?.filter(row =>
		row.components.every(component =>
			['firstPage', 'previousPage', 'nextPage', 'lastPage', 'pageInfo'].includes(component.customId || '')
		)
	);
	const selectMenu = message.components?.filter(row =>
		row.components.every(component => component.customId === 'pageSelectMenu')
	);
	const filter = (interaction: MessageComponentInteraction) =>
		['firstPage', 'previousPage', 'nextPage', 'lastPage', 'pageSelectMenu'].includes(interaction.customId);

	const collector = await message.createMessageComponentCollector({ filter, time: 60000 });

	collector.on('collect', async interaction => {
		if (interaction.customId === 'pageSelectMenu' && interaction.isSelectMenu())
			return onSelectMenu(interaction, selectMenu[0], message, pages);

		return onButton(interaction as ButtonInteraction, buttons[0], message, pages);
	});
}

// TODO Check for duplicated components on interaction.update()
// TODO Check positions for each component and update them in correct one

async function onSelectMenu(
	interaction: SelectMenuInteraction,
	component: MessageActionRow,
	message: Message,
	pages: MessageEmbed[]
) {
	const selectMenu = component.components[0] as MessageSelectMenu;
	const otherComponents = message.components.filter(row =>
		row.components.every((element, index) => element.customId !== component.components[index]?.customId)
	);
	const selectedPage = +interaction.values[0].slice(4);

	selectMenu.options.forEach(option => {
		option.default = false;
		if (option.value === `page${selectedPage}`) option.default = true;
	});

	await interaction
		.update({
			embeds: [pages[selectedPage]],
			components: [component, ...otherComponents],
		})
		.catch(logger.error);
}

async function onButton(
	interaction: ButtonInteraction,
	component: MessageActionRow,
	message: Message,
	pages: MessageEmbed[]
) {
	const components = component.components as MessageButton[];
	const firstButton = components.find(b => b.customId === 'firstPage');
	if (!firstButton) return;
	const previousButton = components.find(b => b.customId === 'previousPage');
	if (!previousButton) return;
	const nextButton = components.find(b => b.customId === 'nextPage');
	if (!nextButton) return;
	const lastButton = components.find(b => b.customId === 'lastPage');
	if (!lastButton) return;
	const pageInfoButton = components.find(b => b.customId === 'pageInfo');
	if (!pageInfoButton) return;

	const otherComponents = message.components.filter(row =>
		row.components.every((element, index) => element.customId !== component.components[index]?.customId)
	);

	let currentPage = +(pageInfoButton.label?.split('/')[0] || 1);

	if (interaction.customId === 'firstPage')
		currentPage = firstPage(firstButton, previousButton, nextButton, lastButton);

	if (interaction.customId === 'nextPage')
		currentPage = nextPage(firstButton, previousButton, nextButton, lastButton, currentPage, pages.length - 1);

	if (interaction.customId === 'previousPage')
		currentPage = previousPage(firstButton, previousButton, nextButton, lastButton, currentPage);

	if (interaction.customId === 'lastPage')
		currentPage = lastPage(firstButton, previousButton, nextButton, lastButton, pages.length - 1);

	pageInfoButton.setLabel(`${currentPage}/${pages.length - 1}`);

	await interaction
		.update({
			embeds: [pages[currentPage]],
			components: [component, ...otherComponents],
		})
		.catch(logger.error);
}

function firstPage(
	firstButton: MessageButton,
	previousButton: MessageButton,
	nextButton: MessageButton,
	lastButton: MessageButton
) {
	firstButton.setDisabled(true);
	previousButton.setDisabled(true);
	nextButton.setDisabled(false);
	lastButton.setDisabled(false);

	return 1;
}

function previousPage(
	firstButton: MessageButton,
	previousButton: MessageButton,
	nextButton: MessageButton,
	lastButton: MessageButton,
	currentPage: number
) {
	nextButton.setDisabled(false);
	lastButton.setDisabled(false);
	if (--currentPage === 1) {
		previousButton.setDisabled(true);
		firstButton.setDisabled(true);
	}

	return currentPage;
}

function nextPage(
	firstButton: MessageButton,
	previousButton: MessageButton,
	nextButton: MessageButton,
	lastButton: MessageButton,
	currentPage: number,
	maxPage: number
) {
	previousButton.setDisabled(false);
	firstButton.setDisabled(false);
	if (++currentPage === maxPage) {
		nextButton.setDisabled(true);
		lastButton.setDisabled(true);
	}

	return currentPage;
}

function lastPage(
	firstButton: MessageButton,
	previousButton: MessageButton,
	nextButton: MessageButton,
	lastButton: MessageButton,
	maxPage: number
) {
	firstButton.setDisabled(false);
	previousButton.setDisabled(false);
	nextButton.setDisabled(true);
	lastButton.setDisabled(true);

	return maxPage;
}

export default new EmbedsModule();
