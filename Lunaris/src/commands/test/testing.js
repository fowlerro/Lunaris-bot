// TODO Add `botResponse` boolean property to commands, bot will respond only if true

const { MessageEmbed } = require('discord.js')
const Embed = require('../../database/schemas/Embed')
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
		
		const embed = await Embed.findOne({ name: "Chuj", guildId: message.guild.id });

		const msg = await Embeds.send(client, embed, embed.guildId, embed.channelId)
		
	},
}
