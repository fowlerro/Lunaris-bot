const ReactionRoles = require("../database/schemas/ReactionRoles")

const fetchReactionMessages = async (client) => {
    let messages = await ReactionRoles.find({});
    messages.forEach( async msg => {
        const guild = await client.guilds.cache.find(guild => guild.id === msg.guildID);
        const channel = await guild.channels.cache.find(channel => channel.id === msg.channelID);
        const message = await channel.messages.fetch(msg.messageID);
        const filter = (reaction, user) => (
            msg.reactions.some(element => reaction.emoji.identifier === element.reaction && !user.bot)
        );
        createEmojiCollector(filter, msg, message);
    });
};

const createReactionMessage = async (guildID, channelID, messageID, reactions, client) => {
    try {
        const reactRoles = await ReactionRoles.create({
            guildID,
            channelID,
            messageID,
            reactions
        });

        const guild = await client.guilds.cache.find(guild => guild.id === guildID);
        const channel = await guild.channels.cache.find(channel => channel.id === channelID);
        const message = await channel.messages.fetch(messageID);

        const filter = (reaction, user) => (
            reactRoles.reactions.some(element => reaction.emoji.identifier === element.reaction && !user.bot)
        );

        createEmojiCollector(filter, reactRoles, message);

        reactions.forEach(element => {
            message.react(element.reaction).catch();
        });
    } catch(err) {
        console.log(err);
    }
};

const createEmojiCollector = (filter, options, message) => {
    const emojiCollector = message.createReactionCollector(filter, {dispose: true});

    emojiCollector.on('collect', (r, user) => {
        const reaction = options.reactions.find(react => react.reaction === r.emoji.identifier);
        const roleID = reaction.role;
        const member = r.message.guild.members.cache.find(m => m.id === user.id);
        member.roles.add(roleID).catch(e => console.log(e));
        if(reaction.mode === 'verify') r.users.remove(user.id);
    });

    emojiCollector.on('remove', (r, user) => {
        const reaction = options.reactions.find(react => react.reaction === r.emoji.identifier);
        if(reaction.mode === 'verify') return;
        const roleID = reaction.role;
        const member = r.message.guild.members.cache.find(m => m.id === user.id);
        member.roles.remove(roleID).catch(e => console.log(e));
    });
}

module.exports = {fetchReactionMessages, createReactionMessage};