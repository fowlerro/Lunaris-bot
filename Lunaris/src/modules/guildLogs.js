/*
Member:
    ?join
    ?leave

    ?nickname

    kicked
    banned
    warned
    muted

Channel:
    created
    deleted
    changed

Voice:
    joined
    leaved
    moved

Roles:
    member:
        added
        removed
    permissions:
        added
        removed
    created
    removed
    position changed
    color changed

Message:
    edited
    removed
    ghost ping

Commands:
    triggered
    tried to trigger

Invites:
    created
    ?(expired)
    invited user
*/

const { MessageEmbed } = require("discord.js");
const { palette } = require("../bot");
const GuildConfig = require("../database/schemas/GuildConfig");
const { getLocale } = require("../utils/languages/languages");

let cachedProfiles = new Map();

const memberJoinedLog = async (client, member) => {
    const guildConfig = await GuildConfig.findOne({guildID: member.guild.id}).catch();
    const logChannel = member.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    const language = guildConfig.get('language');
    if(!logChannel) return;

    const createdAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(member.user.createdAt);
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(getLocale(language, 'memberJoinedLogTitle', member.user.tag), member.user.displayAvatarURL())
        .setDescription(`<@${member.user.id}>`)
        .addField(getLocale(language, 'memberLogCreatedAt'), createdAt, true)
        .addField("ID", member.user.id, true)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    await logChannel.send(embed).catch();
}

const memberLeavedLog = async (client, member) => {
    const guildConfig = await GuildConfig.findOne({guildID: member.guild.id}).catch();
    const logChannel = member.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    const language = guildConfig.get('language');
    if(!logChannel) return;

    const createdAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(member.user.createdAt);
    const joinedAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(member.user.joinedTimestamp);
    const roles = member.roles.cache.map(role => role.name !== '@everyone' ? `<@&${role.id}>` : '').toString().replaceAll(",", " ");

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(getLocale(language, 'memberLeavedLogTitle', member.user.tag), member.user.displayAvatarURL())
        .setDescription(`<@${member.user.id}>`)
        .addField(getLocale(language, 'memberLogCreatedAt'), createdAt, true)
        .addField(getLocale(language, 'memberLogJoinedAt'), joinedAt, true)
        .addField("ID", member.user.id, true)

        member.nickname && embed.addField("Nickname", member.nickname, true);
        roles && embed.addField('Roles', roles, true);
        embed.setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

    const msg = await logChannel.send(embed).catch();
    // msg.react('🔽');
    // cachedProfiles.set(msg.id, member);

    // const filter = (reaction, user) => ((reaction.emoji.name === '🔽' || reaction.emoji.name === '🔼') && !user.bot);

    // const emojiCollector = msg.createReactionCollector(filter, {dispose: true});

    // emojiCollector.on('collect', (r, user) => {
    //     const member = cachedProfiles.get(r.message.id);
    //     const createdAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(member.user.createdAt);
    //     const joinedAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(member.user.joinedTimestamp);
    //     if(r.emoji.name === '🔽') {
    //         if(!r.users.cache.get(client.user.id)) return r.remove();
    //         const roles = member.roles.cache.map(role => role.name !== '@everyone' ? `<@&${role.id}>` : '').toString().replaceAll(",", " ");

    //         const embedExpand = new MessageEmbed()
    //             .setColor(palette.info)
    //             .setAuthor(getLocale(language, 'memberLeavedLogTitle', member.user.tag), member.user.displayAvatarURL())
    //             .setDescription(`<@${member.user.id}>`)
    //             .addField(getLocale(language, 'memberLogCreatedAt'), createdAt, true)
    //             .addField(getLocale(language, 'memberLogJoinedAt'), joinedAt, true)

    //         member.nickname && embedExpand.addField("Nickname", member.nickname, true);
    //         embedExpand.addField("ID", member.user.id, true);
    //         roles && embedExpand.addField('Roles', roles, true);
    //         embedExpand.setFooter(client.user.username, client.user.displayAvatarURL())
    //             .setTimestamp();

    //         msg.edit(embedExpand);
    //         msg.react('🔼');
    //         r.remove();
    //     }
    //     if(r.emoji.name === '🔼') {
    //         if(!r.users.cache.get(client.user.id)) return r.remove();
            
    //         const embedContract = new MessageEmbed()
    //             .setColor(palette.info)
    //             .setAuthor(getLocale(language, 'memberLeavedLogTitle', member.user.tag), member.user.displayAvatarURL())
    //             .setDescription(`<@${member.user.id}>`)
    //             .addField(getLocale(language, 'memberLogCreatedAt'), createdAt, true)
    //             .addField(getLocale(language, 'memberLogJoinedAt'), joinedAt, true)
                
    //         member.nickname && embedContract.addField("Nickname", member.nickname, true);
    //         embedContract.addField("ID", member.user.id, true)
    //             .setFooter(client.user.username, client.user.displayAvatarURL())
    //             .setTimestamp();

    //         msg.edit(embedContract);
    //         msg.react('🔽');
    //         r.remove();
    //     }
    // });
}

const memberNicknameLog = async (client, executor, target, oldNickname, newNickname, logChannel, language) => {

    let variant;
    if(oldNickname && newNickname) {
        variant = 'Changed'
    } else if(!oldNickname && newNickname) {
        variant = 'Created'
    } else if(oldNickname && !newNickname) {
        variant = 'Removed'
    } 

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(getLocale(language, `memberNickname${variant}LogTitle`, target.tag), target.displayAvatarURL())
        .setDescription(getLocale(language, `memberNickname${variant}LogDesc`, `<@${executor.id}>`, `<@${target.id}>`));
    oldNickname && embed.addField(getLocale(language, 'memberNicknameLogOld'), oldNickname, true);
    newNickname && embed.addField(getLocale(language, 'memberNicknameLogNew'), newNickname, true);
    embed.setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    await logChannel.send(embed).catch();
}

module.exports = {memberJoinedLog, memberLeavedLog, memberNicknameLog};