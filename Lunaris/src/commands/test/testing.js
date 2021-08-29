// TODO Add `botResponse` boolean property to commands, bot will respond only if true

const { MessageEmbed } = require('discord.js')
const Embeds = require('../../modules/Embeds')

module.exports = {
	name: 'test',
	aliases: [],
	ownerOnly: true,
	minArgs: null,
	maxArgs: null,
	autoRemove: true,
	autoRemoveResponse: true,
	globalStatus: true,
	status: true,

	description: {
		pl: 'Testowa komenda',
		en: 'Testing command',
	},
	category: 'test',

	permissions: [],
	allowedChannels: [],
	blockedChannels: [],
	allowedRoles: [],
	blockedRoles: [],

	cooldownStatus: false,
	cooldown: '30s',
	cooldownPermissions: [],
	cooldownChannels: [],
	cooldownRoles: [],
	cooldownReminder: true,
	async run(client, message, args) {
		const fields = []
		for (let i = 1; i < 27; i++) {
			fields.push({
				name: `chuj${i}`,
				value: `chuj${i}`,
				// value: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu`,
				inline: true,
			})
		}

		const embed = new MessageEmbed()
			// .setTitle('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium.ddddddd')
			.addFields(fields)

		const embeds = Embeds.checkLimits(embed, true, 9)
		if(embeds?.error)
			return message.channel.send({ content: 'Error' })

		const msg = await Embeds.pageEmbeds(client, embeds, message.guild.id, message.channel.id, 1, true)

		
	},
}
