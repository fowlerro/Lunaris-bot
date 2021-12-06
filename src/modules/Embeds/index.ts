import { ButtonInteraction, Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, TextChannel } from "discord.js"
import { Snowflake } from "discord-api-types"

import BaseModule from "../../utils/structures/BaseModule"
import { Embed } from "../../database/schemas/Embed"

const EMBED_LIMITS = {
	title: 256,
	author: 256,
	description: 4096,
	field: {
		amount: 25,
		name: 256,
		value: 1024,
	},
	footer: 2048,
}

class EmbedsModule extends BaseModule {
	constructor() {
		super('Embeds', true)
	}

	async run() {}

	async send(embedData: Embed, guildId: Snowflake, channelId: Snowflake) {
		const guild = await client.guilds.fetch(guildId).catch(e => {})
		if(!guild) return { error: "Guild not found" }
		const channel = await guild.channels.fetch(channelId).catch(e => {})
		if(!channel) return { error: "Channel not found" }

		const e = new MessageEmbed(embedData.embed)

		const { pages, error } = this.checkLimits(e, true)
		if(error) return

		return this.pageEmbeds(embedData.messageContent, pages, guildId, channelId, 1, true)
	}
	checkLimits(embed: MessageEmbed, pageEmbed = true, maxFields = 25) {
		checkTitle(embed)
		checkAuthor(embed)
		checkDescription(embed)
		checkFooter(embed)

		const pages: MessageEmbed[] = checkFields(embed, maxFields) ? (pageEmbed ? divideFields(embed, maxFields) : [embed]) : [embed]
		if (checkPagesTotalLimit(pages)) return { error: '6000', pages: [] }

		return {
			error: false,
			pages
		}
	}
	async pageEmbeds(messageContent: string | undefined, embeds: MessageEmbed[], guildId: Snowflake, channelId: Snowflake, defaultPage = 1, buttons = true, selectMenu = false) {
		const guild = await client.guilds.fetch(guildId).catch(e => {})
		if(!guild) return
		const channel = await (guild.channels.fetch(channelId) as Promise<TextChannel>).catch(e => {})
		if(!channel) return

		if(embeds.length === 1) return channel.send({ embeds: [embeds[0]] })

		const components = []
		selectMenu && components.push(addSelectMenu(embeds, defaultPage))
		buttons && components.push(addButtons(embeds, defaultPage))
		
		const message = await channel.send({ content: messageContent, embeds: [embeds[defaultPage] || embeds[0]], components })
		// message.currentPage = defaultPage
		createCollectors(message, embeds)

		return message
	}
}

function checkTitle(embed: MessageEmbed) {
	if (embed.title && embed.title.length > EMBED_LIMITS.title)
		embed.setTitle(embed.title.slice(0, EMBED_LIMITS.title - 3) + '...')
}

function checkAuthor(embed: MessageEmbed) {
	if (embed.author?.name && embed.author.name.length > EMBED_LIMITS.author)
		embed.setAuthor(embed.author.name.slice(0, EMBED_LIMITS.author - 3) + '...', embed.author.iconURL, embed.author.url)
}

function checkDescription(embed: MessageEmbed) {
	if (embed.description && embed.description.length > EMBED_LIMITS.description)
		embed.setDescription(embed.description.slice(0, EMBED_LIMITS.description - 3) + '...')
}

function checkFooter(embed: MessageEmbed) {
	if (embed.footer?.text && embed.footer.text.length > EMBED_LIMITS.footer)
		embed.setFooter(embed.footer.text.slice(0, EMBED_LIMITS.footer - 3) + '...', embed.footer.iconURL)
}

function checkFields(embed: MessageEmbed, maxFields: number) {
	embed.fields.forEach(field => {
		if (field.name.length > EMBED_LIMITS.field.name) field.name = field.name.slice(0, EMBED_LIMITS.field.name - 3) + '...'

		if (field.value.length > EMBED_LIMITS.field.value)
			field.value = field.value.slice(0, EMBED_LIMITS.field.value - 3) + '...'
	})

	if (embed.fields.length <= (maxFields || EMBED_LIMITS.field.amount)) return false
	return true
}

function divideFields(embed: MessageEmbed, maxFields: number) {
	const fieldsAmount = embed.fields.length
	const pageAmount = Math.ceil(fieldsAmount / (maxFields || EMBED_LIMITS.field.amount))

	const embeds = [embed]

	for (let i = 0; i < pageAmount; i++) {
		const e = new MessageEmbed()

		e.author = embed.author
		e.title = embed.title
		e.color = embed.color
		e.description = embed.description
		e.footer = embed.footer
		e.image = embed.image
		e.thumbnail = embed.thumbnail
		e.url = embed.url
		e.fields = embed.fields
		e.fields = e.fields.slice(
			i * (maxFields || EMBED_LIMITS.field.amount),
			(i + 1) * (maxFields || EMBED_LIMITS.field.amount)
		)

		embeds.push(e)
	}

	return embeds
}

function checkPagesTotalLimit(pages: MessageEmbed[]) {
	return pages.reduce((prev, curr, index) => {
		return index === 0 ? false : prev ? true : (pages[index].length > 6000)
	}, false)
}

function addButtons(pages: MessageEmbed[], defaultPage: number) {
	defaultPage = defaultPage > pages.length ? pages.length : defaultPage > 0 ? defaultPage : 1

	const firstPageButton = new MessageButton()
	    .setStyle('PRIMARY')
	    .setEmoji("⏮️")
	    .setCustomId('firstPage')
		.setDisabled(defaultPage === 1)

	const previousPageButton = new MessageButton()
		.setStyle('PRIMARY')
		.setEmoji('◀️')
		.setCustomId('previousPage')
		.setDisabled(defaultPage === 1)

	const nextPageButton = new MessageButton()
		.setStyle('PRIMARY')
		.setEmoji('▶️')
		.setCustomId('nextPage')
		.setDisabled(defaultPage === pages.length)

	const lastPageButton = new MessageButton()
	    .setStyle('PRIMARY')
	    .setEmoji("⏭️")
	    .setCustomId('lastPage')
		.setDisabled(defaultPage === pages.length)

	const pageInfoButton = new MessageButton()
		.setStyle('PRIMARY')
		.setLabel(`${defaultPage}/${pages.length-1}`)
		.setCustomId('pageInfo')
		.setDisabled()

	return new MessageActionRow().addComponents([firstPageButton, previousPageButton, pageInfoButton, nextPageButton, lastPageButton])
}

function addSelectMenu(pages: MessageEmbed[], defaultPage: number) {
	defaultPage = defaultPage > pages.length ? pages.length : (defaultPage > 0 ? defaultPage : 1)

	const options = []
	for(let i=1; i<pages.length; i++) {
		options.push({
			label: `Page ${i}`,
			value: `page${i}`,
			default: i === defaultPage
		})
	}

	const selectMenu = new MessageSelectMenu()
		.setCustomId('pageSelectMenu')
		.addOptions(options)

	return new MessageActionRow().addComponents([selectMenu])
}

async function createCollectors(message: Message, pages: MessageEmbed[]) {
	const buttons = message.components.filter(row => row.components.every(component => ['firstPage', 'previousPage', 'nextPage', 'lastPage', 'pageInfo'].includes(component.customId || '')))
	const selectMenu = message.components.filter(row => row.components.every(component => component.customId === 'pageSelectMenu'))
	const filter = (interaction: ButtonInteraction | SelectMenuInteraction) => ['firstPage', 'previousPage', 'nextPage', 'lastPage', 'pageSelectMenu'].includes(interaction.customId)

	const collector = await message.createMessageComponentCollector({ filter, time: 60000 })

	collector.on('collect', async interaction => {
		if(interaction.customId === 'pageSelectMenu' && interaction.componentType === 'SELECT_MENU')
			return onSelectMenu(interaction, selectMenu[0], message, pages)
		
		return onButton(interaction as ButtonInteraction, buttons[0], message, pages)
	})
}

async function onSelectMenu(interaction: SelectMenuInteraction, component: MessageActionRow, message: Message, pages: MessageEmbed[]) {
	const selectMenu = component.components[0] as MessageSelectMenu
	const otherComponents = message.components.filter(row => row !== component)
	const selectedPage = +interaction.values[0].slice(4)

	selectMenu.options.forEach(option => {
		option.default = false
		if(option.value === `page${selectedPage}`) option.default = true
	})

	await interaction.update({
		embeds: [pages[selectedPage]],
		components: [component, ...otherComponents],
	})
}

async function onButton(interaction: ButtonInteraction, component: MessageActionRow, message: Message, pages: MessageEmbed[]) {
	const components = component.components as MessageButton[]
	const firstButton = components.find(b => b.customId === 'firstPage')
	if(!firstButton) return
	const previousButton = components.find(b => b.customId === 'previousPage')
	if(!previousButton) return
	const nextButton = components.find(b => b.customId === 'nextPage')
	if(!nextButton) return
	const lastButton = components.find(b => b.customId === 'lastPage')
	if(!lastButton) return
	const pageInfoButton = components.find(b => b.customId === 'pageInfo')
	if(!pageInfoButton) return

	const otherComponents = message.components.filter(row => row !== component)
	let currentPage = +(pageInfoButton.label?.split('/')[0] || 1);

	if (interaction.customId === 'firstPage') 
		currentPage = firstPage(firstButton, previousButton, nextButton, lastButton)

	if (interaction.customId === 'nextPage')
		currentPage = nextPage(firstButton, previousButton, nextButton, lastButton, currentPage, pages.length-1)

	if (interaction.customId === 'previousPage')
		currentPage = previousPage(firstButton, previousButton, nextButton, lastButton, currentPage)

	if (interaction.customId === 'lastPage')
		currentPage = lastPage(firstButton, previousButton, nextButton, lastButton, pages.length-1)

	pageInfoButton.setLabel(`${currentPage}/${pages.length-1}`)

	await interaction.update({
		embeds: [pages[currentPage]],
		components: [component, ...otherComponents],
	})
}

function firstPage(firstButton: MessageButton, previousButton: MessageButton, nextButton: MessageButton, lastButton: MessageButton) {
	firstButton.setDisabled(true)
	previousButton.setDisabled(true)
	nextButton.setDisabled(false)
	lastButton.setDisabled(false)

	return 1
}

function previousPage(firstButton: MessageButton, previousButton: MessageButton, nextButton: MessageButton, lastButton: MessageButton, currentPage: number) {
	nextButton.setDisabled(false)
	lastButton.setDisabled(false)
	if (--currentPage === 1) {
		previousButton.setDisabled(true)
		firstButton.setDisabled(true)
	}

	return --currentPage
}

function nextPage(firstButton: MessageButton, previousButton: MessageButton, nextButton: MessageButton, lastButton: MessageButton, currentPage: number, maxPage: number) {
	previousButton.setDisabled(false)
	firstButton.setDisabled(false)
	if (++currentPage === maxPage) {
		nextButton.setDisabled(true)
		lastButton.setDisabled(true)
	}

	return ++currentPage
}

function lastPage(firstButton: MessageButton, previousButton: MessageButton, nextButton: MessageButton, lastButton: MessageButton, maxPage: number) {
	firstButton.setDisabled(false)
	previousButton.setDisabled(false)
	nextButton.setDisabled(true)
	lastButton.setDisabled(true)

	return maxPage
}
