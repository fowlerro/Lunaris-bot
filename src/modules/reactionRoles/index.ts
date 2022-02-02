import { Message, MessageReaction, User, Snowflake } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";
import { ReactionRoleDocument, ReactionRoleModel } from "../../database/schemas/ReactionRoles";
import type { Reactions } from 'types'

class ReactionRolesModule extends BaseModule {
    constructor() {
      super('ReactionRoles', true);
    }

    async run() {
      console.log(this.getName())
      await this.fetchMessages()
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
    async create(guildId: Snowflake, channelId: Snowflake, messageId: Snowflake, reactions: Reactions[]) {
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

async function createEmojiCollector(options: ReactionRoleDocument, message: Message) {

    const filter = (reaction: MessageReaction, user: User) => (
        options.reactions.some(element => reaction.emoji.name === element.reaction && !user.bot)
    )
    
    options.reactions.forEach(async element => {
        await message.react(`${element.reaction}`)
    });

    const emojiCollector = message.createReactionCollector({ filter, dispose: true });

    emojiCollector.on('collect', async (r, user) => {
        if(!client.isOnline) return;
        const reaction = options.reactions.find(react => react.reaction === r.emoji.name);
        if(!reaction) return
        const roleId = reaction.roleId;
        const member = await r.message.guild?.members.fetch(user.id).catch(() => {})
        if(!member) return
        await member.roles.add(roleId).catch(e => console.log(e));
        if(reaction.mode === 'verify') r.users.remove(user.id);
    });

    emojiCollector.on('remove', async (r, user) => {
        if(!client.isOnline) return;
        const reaction = options.reactions.find(react => react.reaction === r.emoji.name);
        if(!reaction) return
        if(reaction.mode === 'verify') return;
        const roleId = reaction.roleId;
        const member = await r.message.guild?.members.fetch(user.id).catch(() => {})
        if(!member) return
        await member.roles.remove(roleId).catch(e => console.log(e));
    });
}

export default new ReactionRolesModule()