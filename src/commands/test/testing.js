// TODO Add `botResponse` boolean property to commands, bot will respond only if true

const { MessageEmbed } = require('discord.js')
const Profiles = require('../../modules/Profiles')

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
		const embed = new MessageEmbed()
			.setColor('#000')
			.setTitle('Title')
			.setURL('https://google.com/')
			.setAuthor('Author', 'https://cdn.discordapp.com/avatars/313346190995619841/4164c45f723be7ae03e665181ec7ef33.webp', 'https://google.com/')
			// .setDescription('Incididunt dolor non non et dolor dolore sint occaecat nulla commodo voluptate. Sint sint do laborum Lorem esse consequat ullamco exercitation consequat nisi ut officia. Est ad eu ea anim consectetur duis officia sint dolore veniam.')
			// .setImage('https://cdn.discordapp.com/avatars/313346190995619841/4164c45f723be7ae03e665181ec7ef33.webp')
			// .setThumbnail('https://cdn.discordapp.com/avatars/313346190995619841/4164c45f723be7ae03e665181ec7ef33.webp')
			// .addField('Chuj', 'chuj', true)
			// .addField('Chuj', 'chuj', true)
			// .addField('Chuj', 'chuj', false)
			// .addField('Chuj', 'chuj', true)
			// .addField('Chuj', 'chuj', true)
			// .setFooter('chuj', 'https://cdn.discordapp.com/avatars/313346190995619841/4164c45f723be7ae03e665181ec7ef33.webp')
			// .setTimestamp()
			
		message.channel.send({ content: "Chuj", embeds: [embed] })
	},
}
