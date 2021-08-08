const ms = require('ms');
const CommandConfig = require("../database/schemas/CommandConfig");
const Cooldowns = require("../database/schemas/Cooldowns");
const { translate } = require("../utils/languages/languages");
const { botOwners } = require('../utils/utils');
const { cmdTriggerLog } = require('./guildLogs');
const helpArgs = ["help", "pomoc", "info"];

const commandHandle = async (client, message) => {
    if(!client.isOnline && !botOwners.includes(message.author.id)) return;

    const guildConfig = client.guildConfigs.get(message.guild.id);
    const prefix = guildConfig.get('prefix');
    const language = guildConfig.get('language');
    if(message.content === `<@!${client.user.id}>`) return message.channel.send(translate(language, "cmd.prefixMessage", "`"+prefix+"`"));
    if (message.content.startsWith(prefix)) {
        const [cmdName, ...cmdArgs] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);
        let command = client.commands.get(cmdName);
        let cmd = command;
        if (command) {
            if(command.cmdArgs) {
                if(command.cmdArgs[cmdArgs[0]]) {
                    command = client.commands.get(command.cmdArgs[cmdArgs[0]]);
                    cmd = command;
                }
            }
            if(command.ownerOnly && !botOwners.includes(message.author.id)) return;
            if(!command.globalStatus) return message.channel.send(translate(language, "cmd.globalStatus"));
            if(!command.ownerOnly) command = await CommandConfig.findOne({guildID: message.guild.id, name: command.name});
            if(!command) {
                command = await CommandConfig.create({
                    guildID: message.guild.id,
                    name: cmd.name,
                    aliases: cmd.aliases,
                    minArgs: cmd.minArgs,
                    maxArgs: cmd.maxArgs,
                    autoRemove: cmd.autoRemove,
                    autoRemoveResponse: cmd.autoRemoveResponse,
                    status: cmd.status,
                    allowedChannels: cmd.allowedChannels,
                    blockedChannels: cmd.blockedChannels,
                    allowedRoles: cmd.allowedRoles,
                    blockedRoles: cmd.blockedRoles,
                    permissions: cmd.permissions,
                    cooldownStatus: cmd.cooldownStatus,
                    cooldown: cmd.cooldown,
                    cooldownPermissions: cmd.cooldownPermissions,
                    cooldownChannels: cmd.cooldownChannels,
                    cooldownRoles: cmd.cooldownRoles,
                    cooldownReminder: cmd.cooldownReminder,
                });
            }
            
            if(command.autoRemove) message.delete();

            if(helpArgs.includes(cmdArgs[0])) return sendHelp(client, command, message);
            
            if(!command.status) return;
            
            if(!checkPermissions(command.permissions, message.member)) return;
            
            if(command.allowedChannels.length !== 0 && !command.allowedChannels.includes(message.channel.id)) return;
            if(command.blockedChannels.length !== 0 && command.blockedChannels.includes(message.channel.id)) return;
            
            if(!checkAllowedRoles(command.allowedRoles, message.member)) return;
            if(!checkBlockedRoles(command.blockedRoles, message.member)) return;
            
            if(!checkArgs(command.minArgs, command.maxArgs, cmdArgs.length)) return;

            if(command.cooldownStatus && ms(command.cooldown) > 0) {
                if(checkPermissions(command.cooldownPermissions, message.member)) {
                    runCmd(client, message, cmd, cmdArgs, command.autoRemoveResponse);
                    return;
                }
                if(command.cooldownChannels.length !== 0 && command.cooldownChannels.includes(message.channel.id)) {
                    runCmd(client, message, cmd, cmdArgs, command.autoRemoveResponse);
                    return;
                }
                if(checkAllowedRoles(command.cooldownRoles, message.member)) {
                    runCmd(client, message, cmd, cmdArgs, command.autoRemoveResponse);
                    return;
                }
                // TODO: Fetch Cooldowns at bot's start
                const userCD = await Cooldowns.findOne({guildID: message.guild.id, userID: message.author.id, cmdName: command.name});
                if(userCD) {
                    if(userCD.cooldown > Date.now()) return;
                    const cdTime = Date.now() + ms(command.cooldown);
                    await Cooldowns.findOneAndUpdate({guildID: message.guild.id, userID: message.author.id, cmdName: command.name}, {
                        cooldown: cdTime,
                    });
                } else {
                    const cdTime = Date.now() + ms(command.cooldown);
                    Cooldowns.create({
                        guildID: message.guild.id,
                        userID: message.author.id,
                        cmdName: command.name,
                        cooldown: cdTime,
                    });
                }
            }
            runCmd(client, message, cmd, cmdArgs, command.autoRemoveResponse);
        }
    }
}

const checkPermissions = (permissions, member) => {
    return member.permissions.has(permissions);
}

const checkArgs = (min, max, argsLength) => {
    if(min === null) min = 0;
    if(max === null) max = argsLength;
    if(argsLength >= min && argsLength <= max) return true;
    return false;
};

const checkAllowedRoles = (allowedRoles, member) => {
    return !allowedRoles.length || member.roles.cache.some(r => allowedRoles.includes(r.id))
}

const checkBlockedRoles = (blockedRoles, member) => {
    return !blockedRoles.length || !member.roles.cache.some(r => blockedRoles.includes(r.id))
}

const sendHelp = async (client, cmd, message) => {
    const helpCmd = client.commands.get('help');
    return runCmd(client, message, helpCmd, [cmd.name], helpCmd.autoRemoveResponse)
}

const runCmd = async (client, message, cmd, cmdArgs, autoRemoveResponse) => {
    const cmdMessage = await cmd.run(client, message, cmdArgs);
    if(autoRemoveResponse && cmdMessage) setTimeout(() => cmdMessage.delete(), 5000);
    cmdTriggerLog(client, cmd.name, message.guild, message.channel.id, message.author, message.content);
}

module.exports = {commandHandle};