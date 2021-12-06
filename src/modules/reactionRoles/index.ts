import { Message, MessageReaction, User } from "discord.js";
import { Snowflake } from "discord-api-types";

import BaseModule from "../../utils/structures/BaseModule";
import { ReactionRole, ReactionRoleModel, Reactions } from "../../database/schemas/ReactionRoles";

class ReactionRolesModule extends BaseModule {
    constructor() {
      super('ReactionRoles', true);
    }

    async run() {
      console.log(this.getName())
    }

    async fetchMessages() {
        const messages = await ReactionRoleModel.find();
        for(const msg of messages) {
            const guild = await client.guilds.fetch(msg.guildId).catch(() => {})
            if(!guild) continue
            const channel = await guild.channels.fetch(msg.channelId).catch(() => {})
            if(!channel || channel.type !== 'GUILD_TEXT') continue
            const message = await channel.messages.fetch(msg.messageId).catch(() => {})
            if(!message) continue

            await createEmojiCollector(msg, message)
        }
    }
    async create(guildId: Snowflake, channelId: Snowflake, messageId: Snowflake, reactions: Reactions) {
        const reactRoles = await ReactionRoleModel.create({
            guildId,
            channelId,
            messageId,
            reactions
        });

        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(!guild) return
        const channel = await guild.channels.fetch(channelId).catch(() => {})
        if(!channel || channel.type !== 'GUILD_TEXT') return
        const message = await channel.messages.fetch(messageId).catch(() => {})
        if(!message) return

        await createEmojiCollector(reactRoles, message);
    }
}

async function createEmojiCollector(options: ReactionRole, message: Message) {

    const filter = (reaction: MessageReaction, user: User) => (
        options.reactions.some(element => reaction.emoji.identifier === element.reaction && !user.bot)
    )
    
    options.reactions.forEach(async element => {
        await message.react(element.reaction);
    });

    const emojiCollector = message.createReactionCollector({ filter, dispose: true });

    emojiCollector.on('collect', async (r, user) => {
        if(!client.isOnline) return;
        const reaction = options.reactions.find(react => react.reaction === r.emoji.identifier);
        if(!reaction) return
        const roleId = reaction.roleId;
        const member = await r.message.guild?.members.fetch(user.id).catch(() => {})
        if(!member) return
        await member.roles.add(roleId).catch(e => console.log(e));
        if(reaction.mode === 'verify') r.users.remove(user.id);
    });

    emojiCollector.on('remove', async (r, user) => {
        if(!client.isOnline) return;
        const reaction = options.reactions.find(react => react.reaction === r.emoji.identifier);
        if(!reaction) return
        if(reaction.mode === 'verify') return;
        const roleId = reaction.roleId;
        const member = await r.message.guild?.members.fetch(user.id).catch(() => {})
        if(!member) return
        await member.roles.remove(roleId).catch(e => console.log(e));
    });
}

export default new ReactionRolesModule()


// const ReactionRoles = require("../../database/schemas/ReactionRoles")

// module.exports = {
//     name: "Reaction Roles",
//     enabled: true,
//     async run(client) {
//         if(!this.enabled) return;
//     },
//     async fetchMessages(client) {
//         let messages = await ReactionRoles.find({});
//         messages.forEach( async msg => {
//             const guild = await client.guilds.cache.find(guild => guild.id === msg.guildId);
//             const channel = await guild.channels.cache.find(channel => channel.id === msg.channelId);
//             const message = await channel.messages.fetch(msg.messageId);
//             const filter = (reaction, user) => (
//                 msg.reactions.some(element => reaction.emoji.identifier === element.reaction && !user.bot)
//             );
//             createEmojiCollector(client, filter, msg, message);
//         });
//     },
//     async create(client, guildId, channelId, messageId, reactions) {
//         const reactRoles = await ReactionRoles.create({
//             guildId,
//             channelId,
//             messageId,
//             reactions
//         });
    
//         const guild = await client.guilds.cache.find(guild => guild.id === guildId);
//         const channel = await guild.channels.cache.find(channel => channel.id === channelId);
//         const message = await channel.messages.fetch(messageId);
    
//         const filter = (reaction, user) => (
//             reactRoles.reactions.some(element => reaction.emoji.identifier === element.reaction && !user.bot)
//         );
    
//         createEmojiCollector(client, filter, reactRoles, message);
//     }
// }

// const createEmojiCollector = (client, filter, options, message) => {
    
//     options.reactions.forEach(async element => {
//         await message.react(element.reaction);
//     });

//     const emojiCollector = message.createReactionCollector({filter, dispose: true});
//     emojiCollector.on('collect', (r, user) => {
//         if(!client.isOnline) return;
//         const reaction = options.reactions.find(react => react.reaction === r.emoji.identifier);
//         const roleId = reaction.role;
//         const member = r.message.guild.members.cache.find(m => m.id === user.id);
//         member.roles.add(roleId).catch(e => console.log(e));
//         if(reaction.mode === 'verify') r.users.remove(user.id);
//     });

//     emojiCollector.on('remove', (r, user) => {
//         if(!client.isOnline) return;
//         const reaction = options.reactions.find(react => react.reaction === r.emoji.identifier);
//         if(reaction.mode === 'verify') return;
//         const roleId = reaction.role;
//         const member = r.message.guild.members.cache.find(m => m.id === user.id);
//         member.roles.remove(roleId).catch(e => console.log(e));
//     });
// }