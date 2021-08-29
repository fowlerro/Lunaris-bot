const { MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')

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

module.exports = {
	name: 'Embeds',
	enabled: true,
	limits: EMBED_LIMITS,
	async run(client) {},
	async send(client, document, guildId, channelId) {
		const guild = await client.guilds.fetch(guildId).catch(e => {})
		if(!guild) return { error: "Guild not found" }
		const channel = await guild.channels.fetch(channelId).catch(e => {})
		if(!channel) return { error: "Channel not found" }

		const embed = document.embed

		const e = new MessageEmbed(embed)
		embed.timestamp.display && e.setTimestamp(embed.timestamp.timestamp || Date.now())

		const embeds = this.checkLimits(e, true)
		if(embeds?.error) return

		return this.pageEmbeds(client, embeds, guildId, channelId, 1, true)
	},
	checkLimits(embed, pageEmbed = true, maxFields = 25) {
		checkTitle(embed)
		checkAuthor(embed)
		checkDescription(embed)
		checkFooter(embed)

		const pages = checkFields(embed, maxFields) ? pageEmbed ? divideFields(embed, maxFields) : [embed] : [embed]
		if (checkPagesTotalLimit(pages)) return { error: '6000' }

		return pages
	},
	async pageEmbeds(client, embeds, guildId, channelId, defaultPage = 1, buttons = true, selectMenu = false) {
		const guild = await client.guilds.fetch(guildId).catch(e => {})
		const channel = await guild.channels.fetch(channelId).catch(e => {})

		if(embeds.length === 1) return channel.send({ embeds: [embeds[0]] })

		const components = []
		selectMenu && components.push(addSelectMenu(embeds, defaultPage))
		buttons && components.push(addButtons(embeds, defaultPage))
		
		const message = await channel.send({ embeds: [embeds[defaultPage] || embeds[0]], components })
		message.currentPage = defaultPage
		createCollectors(message, embeds, defaultPage)

		return message
	}
}

function checkTitle(embed) {
	if (embed.title && embed.title.length > EMBED_LIMITS.title)
		embed.setTitle(embed.title.slice(0, EMBED_LIMITS.title - 3) + '...')
}

function checkAuthor(embed) {
	if (embed.author && embed.author.name.length > EMBED_LIMITS.author)
		embed.setAuthor(embed.author.name.slice(0, EMBED_LIMITS.author - 3) + '...', embed.author.iconURL, embed.author.url)
}

function checkDescription(embed) {
	if (embed.description && embed.description.length > EMBED_LIMITS.description)
		embed.setDescription(embed.description.slice(0, EMBED_LIMITS.description - 3) + '...')
}

function checkFooter(embed) {
	if (embed.footer && embed.footer.text.length > EMBED_LIMITS.footer)
		embed.setFooter(embed.footer.text.slice(0, EMBED_LIMITS.footer - 3) + '...', embed.footer.iconURL)
}

function checkFields(embed, maxFields) {
	embed.fields.forEach(field => {
		if (field.name.length > EMBED_LIMITS.field.name) field.name = field.name.slice(0, EMBED_LIMITS.field.name - 3) + '...'

		if (field.value.length > EMBED_LIMITS.field.value)
			field.value = field.value.slice(0, EMBED_LIMITS.field.value - 3) + '...'
	})

	if (embed.fields.length <= (maxFields || EMBED_LIMITS.field.amount)) return false
	return true
}

function divideFields(embed, maxFields) {
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

function checkPagesTotalLimit(pages) {
	return pages.reduce((prev, curr, index) => {
		return index === 0 ? false : prev ? true : (pages[index].length > 6000)
	}, false)
}

function addButtons(pages, defaultPage) {
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

function addSelectMenu(pages, defaultPage) {
	defaultPage = defaultPage > pages.length ? pages.length : defaultPage > 0 ? defaultPage : 1

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

async function createCollectors(message, pages) {
	const buttons = message.components.filter(row => row.components.every(component => ['firstPage', 'previousPage', 'nextPage', 'lastPage', 'pageInfo'].includes(component.customId)))
	const selectMenu = message.components.filter(row => row.components.every(component => component.customId === 'pageSelectMenu'))
	const filter = interaction => ['firstPage', 'previousPage', 'nextPage', 'lastPage', 'pageSelectMenu'].includes(interaction.customId)

	const collector = await message.createMessageComponentCollector({ filter, time: 60000 })

	collector.on('collect', async interaction => {
		if(interaction.customId === 'pageSelectMenu')
			return onSelectMenu(interaction, selectMenu[0], message, pages)
		
		return onButton(interaction, buttons[0], message, pages)
	})
}

async function onSelectMenu(interaction, component, message, pages) {
	const selectMenu = component.components[0]
	const otherComponents = message.components.filter(row => row !== component)
	const selectedPage = interaction.values[0].slice(4)
	message.currentPage = selectedPage

	selectMenu.options.forEach(option => {
		option.default = false
		if(option.value === `page${selectedPage}`) option.default = true
	})

	await interaction.update({
		embeds: [pages[message.currentPage]],
		components: [component, ...otherComponents],
	})
}

async function onButton(interaction, component, message, pages) {
	const firstButton = component.components.find(b => b.customId === 'firstPage')
	const previousButton = component.components.find(b => b.customId === 'previousPage')
	const nextButton = component.components.find(b => b.customId === 'nextPage')
	const lastButton = component.components.find(b => b.customId === 'lastPage')
	const pageInfoButton = component.components.find(b => b.customId === 'pageInfo')

	const otherComponents = message.components.filter(row => row !== component)

	if (interaction.customId === 'firstPage') 
		firstPage(message, firstButton, previousButton, nextButton, lastButton)

	if (interaction.customId === 'nextPage')
		nextPage(message, firstButton, previousButton, nextButton, lastButton, pages.length-1)

	if (interaction.customId === 'previousPage')
		previousPage(message, firstButton, previousButton, nextButton, lastButton)

	if (interaction.customId === 'lastPage')
		lastPage(message, firstButton, previousButton, nextButton, lastButton, pages.length-1)

	pageInfoButton.setLabel(`${message.currentPage}/${pages.length-1}`)

	await interaction.update({
		embeds: [pages[message.currentPage]],
		components: [component, ...otherComponents],
	})
}

function firstPage(message, firstButton, previousButton, nextButton, lastButton) {
	message.currentPage = 1
	firstButton.setDisabled(true)
	previousButton.setDisabled(true)
	nextButton.setDisabled(false)
	lastButton.setDisabled(false)
}

function previousPage(message, firstButton, previousButton, nextButton, lastButton) {
	message.currentPage--
	nextButton.setDisabled(false)
	lastButton.setDisabled(false)
	if (message.currentPage === 1) {
		previousButton.setDisabled(true)
		firstButton.setDisabled(true)
	}
}

function nextPage(message, firstButton, previousButton, nextButton, lastButton, maxPage) {
	message.currentPage++
	previousButton.setDisabled(false)
	firstButton.setDisabled(false)
	if (message.currentPage === maxPage) {
		nextButton.setDisabled(true)
		lastButton.setDisabled(true)
	}
}

function lastPage(message, firstButton, previousButton, nextButton, lastButton, maxPage) {
	message.currentPage = maxPage
	firstButton.setDisabled(false)
	previousButton.setDisabled(false)
	nextButton.setDisabled(true)
	lastButton.setDisabled(true)
}
