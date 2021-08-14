const ReactionRoles = require("../database/schemas/ReactionRoles")

const fetchReactionMessages = async (client) => {
    let messages = await ReactionRoles.find({});
    messages.forEach( async msg => {
        const guild = await client.guilds.cache.find(guild => guild.id === msg.guildId);
        const channel = await guild.channels.cache.find(channel => channel.id === msg.channelId);
        const message = await channel.messages.fetch(msg.messageId);
        const filter = (reaction, user) => (
            msg.reactions.some(element => reaction.emoji.identifier === element.reaction && !user.bot)
        );
        createEmojiCollector(client, filter, msg, message);
    });
};

const createReactionMessage = async (guildId, channelId, messageId, reactions, client) => {
    const reactRoles = await ReactionRoles.create({
        guildId,
        channelId,
        messageId,
        reactions
    });

    const guild = await client.guilds.cache.find(guild => guild.id === guildId);
    const channel = await guild.channels.cache.find(channel => channel.id === channelId);
    const message = await channel.messages.fetch(messageId);

    const filter = (reaction, user) => (
        reactRoles.reactions.some(element => reaction.emoji.identifier === element.reaction && !user.bot)
    );

    createEmojiCollector(client, filter, reactRoles, message);
};

const createEmojiCollector = (client, filter, options, message) => {

    options.reactions.forEach(async element => {
        await message.react(element.reaction);
    });

    const emojiCollector = message.createReactionCollector({filter, dispose: true});
    emojiCollector.on('collect', (r, user) => {
        if(!client.isOnline) return;
        const reaction = options.reactions.find(react => react.reaction === r.emoji.identifier);
        const roleId = reaction.role;
        const member = r.message.guild.members.cache.find(m => m.id === user.id);
        member.roles.add(roleId).catch(e => console.log(e));
        if(reaction.mode === 'verify') r.users.remove(user.id);
    });

    emojiCollector.on('remove', (r, user) => {
        if(!client.isOnline) return;
        const reaction = options.reactions.find(react => react.reaction === r.emoji.identifier);
        if(reaction.mode === 'verify') return;
        const roleId = reaction.role;
        const member = r.message.guild.members.cache.find(m => m.id === user.id);
        member.roles.remove(roleId).catch(e => console.log(e));
    });
}

module.exports = {fetchReactionMessages, createReactionMessage};