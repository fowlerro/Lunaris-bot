// import { Message } from "discord.js"
// import Guilds from "../../modules/Guilds"
// import DiscordClient from "../../types/client"

// // TODO Add `botResponse` boolean property to commands, bot will respond only if true

// module.exports = {
// 	name: 'test',
// 	aliases: [],
// 	ownerOnly: true,
// 	minArgs: null,
// 	maxArgs: null,
// 	autoRemove: true,
// 	autoRemoveResponse: true,
// 	globalStatus: true,
// 	status: true,

// 	description: {
// 		pl: 'Testowa komenda',
// 		en: 'Testing command',
// 	},
// 	category: 'test',

// 	permissions: [],
// 	allowedChannels: [],
// 	blockedChannels: [],
// 	allowedRoles: [],
// 	blockedRoles: [],

// 	cooldownStatus: false,
// 	cooldown: '30s',
// 	cooldownPermissions: [],
// 	cooldownChannels: [],
// 	cooldownRoles: [],
// 	cooldownReminder: true,
// 	async run(client: DiscordClient, message: Message, args: any) {
// 		if(!message.guild) return
// 		console.log(Guilds.getName())
// 		const config = await Guilds.config.get(message.guild.id)
// 		console.log(config)

// 		// const embed = new MessageEmbed()
// 			// .setColor('#000')
// 			// .setTitle('Title')
// 			// .setURL('https://google.com/')
// 			// .setAuthor('Author', 'https://cdn.discordapp.com/avatars/313346190995619841/4164c45f723be7ae03e665181ec7ef33.webp', 'https://google.com/')
// 			// .setDescription('Incididunt dolor non non et dolor dolore sint occaecat nulla commodo voluptate. Sint sint do laborum Lorem esse consequat ullamco exercitation consequat nisi ut officia. Est ad eu ea anim consectetur duis officia sint dolore veniam.')
// 			// .setImage('https://cdn.discordapp.com/avatars/313346190995619841/4164c45f723be7ae03e665181ec7ef33.webp')
// 			// .setThumbnail('https://cdn.discordapp.com/avatars/313346190995619841/4164c45f723be7ae03e665181ec7ef33.webp')
// 			// .addField('Chuj', 'chuj', true)
// 			// .addField('Chuj', 'chuj', true)
// 			// .addField('Chuj', 'chuj', false)
// 			// .addField('Chuj', 'chuj', true)
// 			// .addField('Chuj', 'chuj', true)
// 			// .setFooter('chuj', 'https://cdn.discordapp.com/avatars/313346190995619841/4164c45f723be7ae03e665181ec7ef33.webp')
// 			// .setTimestamp()

// 		// const embed = new MessageEmbed()
// 		// 	.setColor(palette.info)
// 		// 	.setTitle('Strony nauczycieli:')
// 		// 	.setDescription(
// 		// 		`[Parowińska](http://zse.gda.pl/~maryp/)
// 		// 		[Grzegrzółka](http://zse.gda.pl/~hagrz/)
// 		// 		[Tadzio](http://zse.gda.pl/~net/)
// 		// 		[Tadzio 2](http://zse.gda.pl/~tt/)
// 		// 		[Kołodko](http://zse.gda.pl/~zk/)
// 		// 		[Gryzio](http://zse.gda.pl/~gr/)
// 		// 		[Rawa](http://zse.gda.pl/~ar/)
// 		// 		[Karwowska](http://zse.gda.pl/~jk/)
// 		// 		[Ochnik](http://153.19.170.6/~witek/)
// 		// 		[EE08](http://ee08.zse.gda.pl/)`
// 		// 	)
// 		// 	.setFooter('jebać ich')

			
// 		// message.channel.send({ embeds: [embed] })
// 	},
// }
