// TODO Add `botResponse` boolean property to commands, bot will respond only if true

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
		
	},
}
