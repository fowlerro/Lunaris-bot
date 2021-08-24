/*
Member:
    ?join
    ?leave

    ?nickname

    ?kicked
    ?banned
    ?unbanned
    ?muted
    ?warned

?Channel:
    ?created
    ?deleted
    ?changed

* https://github.com/discord/discord-api-docs/issues/2280
!Voice:
    !joined
    !leaved
    !moved

?Roles:
    ?member:
        ?added
        ?removed
    ?permissions:
        ?added
        ?removed
    ?created
    ?removed
    position changed
    ?color changed

?Message:
    ?edited
    ?removed

Commands:
    ?triggered
    tried to trigger

?Invites:
    ?created
    ?(expired)
*/

// TODO Rewrite guild logs module

const { MessageEmbed, Permissions } = require("discord.js");
const { palette } = require("../utils/utils");
const { translate } = require("../utils/languages/languages");
const ms = require('ms');

async function memberJoinedLog(client, member) {
    const guildConfig = client.guildConfigs.get(member.guild.id);
    const logChannel = member.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const createdAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(member.user.createdAt);
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.member.joinedTitle', member.user.tag), member.user.displayAvatarURL())
        .setDescription(`<@${member.user.id}>`)
        .addField(translate(language, 'general.createdAt'), createdAt, true)
        .addField("ID", member.user.id, true)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}

function memberLeavedLog(client, member, logChannel, language) {

    const createdAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(member.user.createdAt);
    // const joinedAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(member.user.joinedTimestamp);
    const roles = member.roles.cache.map(role => role.name !== '@everyone' ? `<@&${role.id}>` : '').toString().replaceAll(",", " ");

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.member.leavedTitle', member.user.tag), member.user.displayAvatarURL())
        .setDescription(`<@${member.user.id}>`)
        .addField(translate(language, 'general.createdAt'), createdAt, true)
        .addField("ID", member.user.id, true);

    member.nickname && embed.addField("Nickname", member.nickname, true);
    roles && embed.addField(translate(language, 'general.roles'), roles);
    embed.setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]});

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
    //             .setAuthor(translate(language, 'logs.member.leavedTitle', member.user.tag), member.user.displayAvatarURL())
    //             .setDescription(`<@${member.user.id}>`)
    //             .addField(translate(language, 'general.createdAt'), createdAt, true)
    //             .addField(translate(language, 'general.joinedAt'), joinedAt, true)

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
    //             .setAuthor(translate(language, 'logs.member.leavedTitle', member.user.tag), member.user.displayAvatarURL())
    //             .setDescription(`<@${member.user.id}>`)
    //             .addField(translate(language, 'general.createdAt'), createdAt, true)
    //             .addField(translate(language, 'general.joinedAt'), joinedAt, true)
                
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

async function memberNicknameLog(client, executor, target, oldNickname, newNickname, logChannel, language) {

    let variant2;
    if(oldNickname && newNickname) {
        variant2 = 'Changed'
    } else if(!oldNickname && newNickname) {
        variant2 = 'Created'
    } else if(oldNickname && !newNickname) {
        variant2 = 'Removed'
    }

    const variant = oldNickname && newNickname ? 'Changed' : !oldNickname && newNickname ? 'Created' : 'Removed';
    console.log('variant', variant);
    console.log('variant2', variant2);


    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, `logs.member.nickname${variant}Title`, target.tag), target.displayAvatarURL())
        .addField(translate(language, 'logs.member.nicknameChangedBy'), `<@${executor.id}>\n${executor.id}`, true);
    oldNickname && embed.addField(translate(language, 'logs.member.nicknameOld'), oldNickname, true);
    newNickname && embed.addField(translate(language, 'logs.member.nicknameNew'), newNickname, true);
    embed.setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}

function memberKickedLog(client, executor, target, member, reason, logChannel, language) {

    const roles = member.roles.cache.map(role => role.name !== '@everyone' ? `<@&${role.id}>` : '').toString().replaceAll(",", " ");
    const kickedAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(new Date());
    reason = reason ? reason : "-";
    
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.member.kickedTitle', target.tag), target.displayAvatarURL())
        .addField(translate(language, 'logs.member.kickedTarget'), `<@${target.id}>\n${target.id}`, true)
        .addField(translate(language, 'general.by'), `<@${executor.id}>\n${executor.id}`, true)
        .addField(translate(language, 'logs.member.kickedAt'), kickedAt, true)
        .addField(translate(language, 'general.reason'), reason, true);
    roles && embed.addField(translate(language, 'general.roles'), roles, true);
    embed.setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}

function memberBannedLog (client, executor, target, member, reason, logChannel, language) {

    const roles = member.roles.cache.map(role => role.name !== '@everyone' ? `<@&${role.id}>` : '').toString().replaceAll(",", " ");
    const bannedAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(new Date());
    reason = reason ? reason : "-";
    
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.member.bannedTitle', target.tag), target.displayAvatarURL())
        .addField(translate(language, 'logs.member.bannedTarget'), `<@${target.id}>\n${target.id}`, true)
        .addField(translate(language, 'general.by'), `<@${executor.id}>\n${executor.id}`, true)
        .addField(translate(language, 'logs.member.bannedAt'), bannedAt, true)
        .addField(translate(language, 'general.reason'), reason, true);
    roles && embed.addField(translate(language, 'general.roles'), roles, true);
    embed.setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}

async function memberUnbannedLog(client, guild, user) {

    const guildConfig = client.guildConfigs.get(guild.id);
    const logChannel = guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const banLog = await guild.fetchAuditLogs({limit: 1, type: 'MEMBER_BAN_REMOVE'});
    const updateBan = banLog.entries.first();
    if(updateBan.target.id === user.id && Date.now() - updateBan.createdTimestamp < 5000) {
        const unbannedAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(new Date());
        
        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'logs.member.unbannedTitle', updateBan.target.tag), updateBan.target.displayAvatarURL())
            .addField(translate(language, 'logs.member.unbannedTarget'), `<@${updateBan.target.id}>\n${updateBan.target.id}`, true)
            .addField(translate(language, 'general.by'), `<@${updateBan.executor.id}>\n${updateBan.executor.id}`, true)
            .addField(translate(language, 'logs.member.unbannedAt'), unbannedAt, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        return logChannel.send({embeds: [embed]});
    }
}


async function channelCreatedLog(client, channel) {
    const guildConfig = client.guildConfigs.get(channel.guild.id);
    const logChannel = channel.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.channel'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const auditLog = await channel.guild.fetchAuditLogs({limit: 1, type: 'CHANNEL_CREATE'});
    const entry = auditLog.entries.first();
    if(entry.target.id === channel.id && Date.now() - entry.createdTimestamp < 5000) {

        const createdAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(entry.createdAt);
        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'logs.channel.createdTitle'), entry.executor.displayAvatarURL())
            .addField(translate(language, 'general.channel'), `<#${channel.id}>\n${channel.id}`, true)
            .addField(translate(language, 'general.by'), `<@${entry.executor.id}>\n${entry.executor.id}`, true)
            .addField(translate(language, 'logs.channel.createdAt'), createdAt, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        return logChannel.send({embeds: [embed]})
    }
}

async function channelDeletedLog(client, channel) {
    const guildConfig = client.guildConfigs.get(channel.guild.id);
    const logChannel = channel.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.channel'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const auditLog = await channel.guild.fetchAuditLogs({limit: 1, type: 'CHANNEL_DELETE'});
    const entry = auditLog.entries.first();
    if(entry.target.id === channel.id && Date.now() - entry.createdTimestamp < 5000) {

        const deletedAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(entry.createdAt);
        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'logs.channel.deletedTitle', channel.name), entry.executor.displayAvatarURL())
            .addField(translate(language, 'general.by'), `<@${entry.executor.id}>\n${entry.executor.id}`, true)
            .addField(translate(language, 'logs.channel.deletedAt'), deletedAt, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        return logChannel.send({embeds: [embed]})
    }
}

async function channelUpdatedLog(client, newChannel) {
    const guildConfig = client.guildConfigs.get(newChannel.guild.id);
    const logChannel = newChannel.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.channel'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    let auditLog = await newChannel.guild.fetchAuditLogs({limit: 1, action: 'CHANNEL_UPDATE'});
    let entry = auditLog.entries.first();
    if(Date.now() - entry.createdTimestamp > 5000) {
        auditLog = await newChannel.guild.fetchAuditLogs({limit: 1, action: 'CHANNEL_OVERWRITE_CREATE'});
        entry = auditLog.entries.first(); 
    }
    if(Date.now() - entry.createdTimestamp > 5000) {
        auditLog = await newChannel.guild.fetchAuditLogs({limit: 1, action: 'CHANNEL_OVERWRITE_UPDATE'});
        entry = auditLog.entries.first(); 
    }
    if(Date.now() - entry.createdTimestamp > 5000) {
        auditLog = await newChannel.guild.fetchAuditLogs({limit: 1, action: 'CHANNEL_OVERWRITE_DELETE'});
        entry = auditLog.entries.first();
    }
    if(entry.target.id === newChannel.id && Date.now() - entry.createdTimestamp < 5000) {
        const changes = entry.changes;
        const name = changes.find(c => c.key === 'name') || undefined;
        const topic = changes.find(c => c.key === 'topic') || undefined;
        const rateLimit = changes.find(c => c.key === 'rate_limit_per_user') || undefined;
        const nsfw = changes.find(c => c.key === 'nsfw') || undefined;
        let allowedPerms = [];
        let deniedPerms = [];
        let resetPerms = [];
        const permsAllow = changes.find(c => c.key === 'allow');
        if(permsAllow) {
            const oldPerms = new Permissions(BigInt(permsAllow.old)).toArray()
            const newPerms = new Permissions(BigInt(permsAllow.new)).toArray()
            newPerms.forEach(element => {
                if(!oldPerms.includes(element)) allowedPerms.push(element);
            });
            oldPerms.forEach(element => {
                if(!newPerms.includes(element)) resetPerms.push(element);
            });
        }
        const permsDeny = changes.find(key => key.key === 'deny');
        if(permsDeny) {
            const oldPerms = new Permissions(BigInt(permsDeny.old)).toArray()
            const newPerms = new Permissions(BigInt(permsDeny.new)).toArray()
            newPerms.forEach(element => {
                if(!oldPerms.includes(element)) deniedPerms.push(element);
            });
            oldPerms.forEach(element => {
                if(!newPerms.includes(element)) resetPerms.push(element);
            });
        }
        resetPerms.forEach(element => {
            if(allowedPerms.includes(element)) resetPerms = resetPerms.filter(e => e !== element);
            if(deniedPerms.includes(element)) resetPerms = resetPerms.filter(e => e !== element);
        })
        
        // console.log("Dodano uprawnienia", allowedPerms)
        // console.log("Zabrano uprawnienia", deniedPerms)
        // console.log("Zresetowano uprawnienia", resetPerms)
        // name, topic, rate_limit_per_user, nsfw

        // const updatedAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(entry.createdAt);
        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'logs.channel.changedTitle', newChannel.name), entry.executor.displayAvatarURL())
            .addField(translate(language, 'general.channel'), `<#${newChannel.id}>\n${newChannel.id}`, true)
            .addField(translate(language, 'general.by'), `<@${entry.executor.id}>\n${entry.executor.id}`, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();
        name && embed.addField(translate(language, 'general.name'), "`" + name.old +"`->`"+ name.new + "`", true);
        topic && embed.addField(translate(language, 'general.description'), 
            `**${translate(language, 'logs.channel.changedOld')}**: ${topic.old}
            **${translate(language, 'logs.channel.changedNew')}**: ${topic.new}`, true);
        
        rateLimit && embed.addField(translate(language, 'general.slowMode'), 
            `**${translate(language, 'logs.channel.changedOld')}**: ${rateLimit.old ? ms(rateLimit.old*1000) : translate(language, 'general.off')}
            **${translate(language, 'logs.channel.changedNew')}**: ${rateLimit.new ? ms(rateLimit.new*1000) : translate(language, 'general.off')}`, true);
            
        nsfw && embed.addField("NSFW", nsfw.new ? translate(language, 'general.on') : translate(language, 'general.off'), true);
        
        allowedPerms.length && embed.addField(translate(language, 'logs.general.allowedPerms'),
            allowedPerms.map(perm => translate(language, `permissions.${perm}`)).toString().replaceAll(",", ", "), true);

        deniedPerms.length && embed.addField(translate(language, 'logs.general.deniedPerms'),
            deniedPerms.map(perm => translate(language, `permissions.${perm}`)).toString().replaceAll(",", ", "), true);

        resetPerms.length && embed.addField(translate(language, 'logs.general.resetPerms'),
            resetPerms.map(perm => translate(language, `permissions.${perm}`)).toString().replaceAll(",", ", "), true);
        
        return logChannel.send({embeds: [embed]});
    }
}



function messageDeletedLog(client, content, channelId, target, executor, logChannel, language) {
    
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.message.deletedTitle'), target.displayAvatarURL())
        // .setDescription(translate(language, 'logs.message.deletedLink', `https://discord.com/channels/${guildId}/${channelId}/${messageId}`))
        .addField(translate(language, 'logs.message.target'), `<@${target.id}>\n${target.id}`, true);
    executor && embed.addField(translate(language, 'general.by'), `<@${executor.id}>\n${executor.id}`, true);
    embed.addField(translate(language, 'general.channel'), `<#${channelId}>`, true)
        .addField(translate(language, 'general.content'), content, true)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]})
}

function messageEditedLog(client, oldContent, newContent, messageId, channelId, guildId, target, logChannel, language) {
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.message.editedTitle'), target.displayAvatarURL())
        .setDescription(translate(language, 'logs.message.editedLink', `https://discord.com/channels/${guildId}/${channelId}/${messageId}`))
        .addField(translate(language, 'logs.message.target'), `<@${target.id}>\n${target.id}`, true)
        .addField(translate(language, 'general.channel'), `<#${channelId}>`, true)
        .addField(translate(language, 'general.content'), 
            `**${translate(language, 'general.before')}**: ${oldContent}
            **${translate(language, 'general.after')}**: ${newContent}`, true)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]})
}



function inviteCreatedLog(client, url, expires, inviter, uses, channelId, logChannel, language) {

    const expiresAt = new Intl.DateTimeFormat(language, {dateStyle: 'long', timeStyle: 'medium'}).format(expires);
    
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.invite.createdTitle'), inviter.displayAvatarURL())
        .addField(translate(language, 'logs.invite.createdBy'), `<@${inviter.id}>\n${inviter.id}`, true)
        .addField(translate(language, 'general.channel'), `<#${channelId}>`, true)
        .addField(translate(language, 'logs.invite.expiresAt'), expiresAt, true)
        .addField('URL', url, true)
        .addField(translate(language, 'logs.invite.maxUses'), uses, true)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}

function inviteDeletedLog(client, code, channelId, logChannel, language) {

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.invite.deletedTitle'))
        .addField(translate(language, 'general.channel'), `<#${channelId}>`, true)
        .addField(translate(language, 'general.code'), code, true)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}



async function cmdTriggerLog(client, cmdName, guild, channelId, executor, content) {
    const guildConfig = client.guildConfigs.get(guild.id);
    const logChannel = guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.commands'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.cmd.triggerTitle', guildConfig.get("prefix") + cmdName), executor.displayAvatarURL())
        .addField(translate(language, 'general.by'), `<@${executor.id}>\n${executor.id}`, true)
        .addField(translate(language, 'general.channel'), `<#${channelId}>\n${channelId}`, true)
        .addField(translate(language, 'general.content'), content, true)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]})
}



function memberRoleLog(client, executor, target, role, state, logChannel, language) {
    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, `logs.member.${state}RoleTitle`, target.tag), target.displayAvatarURL())
        .addField('Target', `<@${target.id}>\n${target.id}`, true)
        .addField(translate(language, 'general.by'), `<@${executor.id}>\n${executor.id}`, true)
        .addField(translate(language, 'general.role'), `<@&${role}>`, true)
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}



async function roleCreatedLog(client, role) {
    const guildConfig = client.guildConfigs.get(role.guild.id);
    const logChannel = role.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.roles'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const auditLog = await role.guild.fetchAuditLogs({limit: 1, action: 'ROLE_CREATE'});
    const entry = auditLog.entries.first();
    if(entry.target.id === role.id && Date.now() - entry.createdTimestamp < 5000) {

        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'logs.role.createdTitle'), entry.executor.displayAvatarURL())
            .addField(translate(language, 'general.role'), `<@&${role.id}>\n${role.id}`, true)
            .addField(translate(language, 'general.by'), `<@${entry.executor.id}>\n${entry.executor.id}`, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        return logChannel.send({embeds: [embed]});
    }
}

async function roleDeletedLog(client, role) {
    const guildConfig = client.guildConfigs.get(role.guild.id);
    const logChannel = role.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.roles'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const auditLog = await role.guild.fetchAuditLogs({limit: 1, action: 'ROLE_DELETE'});
    const entry = auditLog.entries.first();
    if(entry.target.id === role.id && Date.now() - entry.createdTimestamp < 5000) {

        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'logs.role.deletedTitle', role.name), entry.executor.displayAvatarURL())
            .addField(translate(language, 'general.by'), `<@${entry.executor.id}>\n${entry.executor.id}`, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();

        return logChannel.send({embeds: [embed]});
    }
}

async function roleUpdatedLog(client, role) {
    const guildConfig = client.guildConfigs.get(role.guild.id);
    const logChannel = role.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.roles'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const auditLog = await role.guild.fetchAuditLogs({limit: 1, action: 'ROLE_UPDATE'});
    const entry = auditLog.entries.first();
    if(entry.target.id === role.id && Date.now() - entry.createdTimestamp < 5000) {
        // console.log(entry);
        const changes = entry.changes;
        const name = changes.find(c => c.key === 'name') || undefined;
        const color = changes.find(c => c.key === 'color') || undefined;
        const hoist = changes.find(c => c.key === 'hoist') || undefined;
        const mentionable = changes.find(c => c.key === 'mentionable') || undefined;
        let allowedPerms = [];
        let deniedPerms = [];
        // console.log(changes)
        let perm = changes.find(c => c.key === 'permissions');
        if(perm) {
            const oldPerms = new Permissions(BigInt(perm.old)).toArray()
            const newPerms = new Permissions(BigInt(perm.new)).toArray()
            newPerms.forEach(element => {
                if(!oldPerms.includes(element)) allowedPerms.push(element);
            });
            oldPerms.forEach(element => {
                if(!newPerms.includes(element)) deniedPerms.push(element);
            });
        }
        
        // console.log("Dodano uprawnienia", allowedPerms)
        // console.log("Zabrano uprawnienia", deniedPerms)
        // console.log("Zresetowano uprawnienia", resetPerms)
        // name, topic, rate_limit_per_user, nsfw

        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setAuthor(translate(language, 'logs.role.changedTitle', role.name), entry.executor.displayAvatarURL())
            .addField(translate(language, 'general.role'), `<@&${role.id}>\n${role.id}`, true)
            .addField(translate(language, 'general.by'), `<@${entry.executor.id}>\n${entry.executor.id}`, true)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp();
        name && embed.addField(translate(language, 'general.name'), 
            `**${translate(language, 'general.old.b')}**: ${name.old}
            **${translate(language, 'general.new.b')}**: ${name.new}`, true);

        color && embed.addField(translate(language, 'general.color'), 
            `**${translate(language, 'general.old.a')}**: #${color.old.toString(16).toUpperCase()}
            **${translate(language, 'general.new.a')}**: #${color.new.toString(16).toUpperCase()}`, true);
        
        hoist && embed.addField(translate(language, 'logs.role.hoist'), hoist.new ? translate(language, 'general.on') : translate(language, 'general.off'), true);
            
        mentionable && embed.addField(translate(language, 'logs.role.mentionable'), mentionable.new ? translate(language, 'general.on') : translate(language, 'general.off'), true);
        
        allowedPerms.length && embed.addField(translate(language, 'logs.general.allowedPerms'),
        allowedPerms.map(perm => translate(language, `permissions.${perm}`)).toString().replaceAll(",", ", "), true);

        deniedPerms.length && embed.addField(translate(language, 'logs.general.deniedPerms'),
        deniedPerms.map(perm => translate(language, `permissions.${perm}`)).toString().replaceAll(",", ", "), true);

        
        return logChannel.send({embeds: [embed]});
    }
}


function warnAddLog(client, guildId, executor, target, reason, id) {
    const guild = client.guilds.cache.find(guild => guild.id === guildId);
    const member = guild.members.cache.find(m => m.id === target);
    if(!member) return;

    const guildConfig = client.guildConfigs.get(guildId);
    const logChannel = guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.warn.addWarn', member.user.tag), member.user.displayAvatarURL())
        .addField('Target', `<@${member.id}>\n${member.id}`, true)
        .addField(translate(language, 'general.by'), `<@${executor}>\n${executor}`, true)
        .addField('ID', '`'+id+'`', true)
        .addField(translate(language, 'general.reason'), reason ? reason : translate(language, 'general.none'))
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}

function warnRemoveLog(client, guildId, by, executor, target, reason, id) {
    const guild = client.guilds.cache.find(guild => guild.id === guildId);
    const member = guild.members.cache.find(m => m.id === target);
    if(!member) return;

    const guildConfig = client.guildConfigs.get(guildId);
    const logChannel = guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.warn.removeWarn', member.user.tag), member.user.displayAvatarURL())
        .addField('Target', `<@${member.id}>\n${member.id}`, true)
        .addField(translate(language, 'logs.warn.addedBy'), `<@${executor}>\n${executor}`, true)
        .addField(translate(language, 'logs.warn.removedBy'), `<@${by}>\n${by}`, true)
        .addField('ID', '`'+id+'`', true)
        .addField(translate(language, 'general.reason'), reason ? reason : translate(language, 'general.none'), true)
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}

function warnRemoveAllLog(client, guildId, by) {
    const guild = client.guilds.cache.find(guild => guild.id === guildId);

    const guildConfig = client.guildConfigs.get(guildId);
    const logChannel = guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.warn.removeAllWarns'), guild.iconURL())
        .addField(translate(language, 'logs.warn.removedBy'), `<@${by}>\n${by}`, true)
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}


function muteLog(client, guildId, by, target, reason, time) {
    const guild = client.guilds.cache.find(guild => guild.id === guildId);
    const member = guild.members.cache.find(m => m.id === target);
    if(!member) return;

    const guildConfig = client.guildConfigs.get(guildId);
    const logChannel = guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.mute.muted', member.user.tag), member.user.displayAvatarURL())
        .addField('Target', `<@${member.id}>\n${member.id}`, true)
        .addField(translate(language, 'logs.mute.addedBy'), `<@${by}>\n${by}`, true)
        .addField(translate(language, 'general.forTime'), time, true)
        .addField(translate(language, 'general.reason'), reason ? reason : translate(language, 'general.none'), true)
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}

function unmuteLog(client, guildId, by, executor, target, reason = "") {
    const guild = client.guilds.cache.find(guild => guild.id === guildId);
    const member = guild.members.cache.find(m => m.id === target);
    if(!member) return;
    
    const guildConfig = client.guildConfigs.get(guildId);
    const logChannel = guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    if(executor != "System") executor = `<@${executor}>\n${executor}`;

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .setAuthor(translate(language, 'logs.mute.unmuted', member.user.tag), member.user.displayAvatarURL())
        .addField('Target', `<@${member.id}>\n${member.id}`, true)
        .addField(translate(language, 'logs.mute.addedBy'), `<@${by}>\n${by}`, true)
        .addField(translate(language, 'logs.mute.removedBy'), executor, true)
        .addField(translate(language, 'general.reason'), reason ? reason : translate(language, 'general.none'), true)
        .setTimestamp();

    return logChannel.send({embeds: [embed]});
}

module.exports = {memberJoinedLog, memberLeavedLog, memberNicknameLog, memberKickedLog, memberBannedLog, memberUnbannedLog,
    channelCreatedLog, channelDeletedLog, channelUpdatedLog,
    messageDeletedLog, messageEditedLog,
    inviteCreatedLog, inviteDeletedLog,
    cmdTriggerLog,
    memberRoleLog,
    roleCreatedLog, roleDeletedLog, roleUpdatedLog,
    warnAddLog, warnRemoveLog, warnRemoveAllLog,
    muteLog, unmuteLog};