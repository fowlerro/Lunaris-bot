const ms = require('ms');
const { botOwners } = require("../bot");
const CommandConfig = require("../database/schemas/CommandConfig");
const Cooldowns = require("../database/schemas/Cooldowns");
const GuildConfig = require("../database/schemas/GuildConfig");
const { translate } = require("../utils/languages/languages");
const { cmdTriggerLog } = require('./guildLogs');
const helpArgs = ["help", "pomoc", "info"];

const commandHandle = async (client, message) => {
    try {
        const guildConfig = await GuildConfig.findOne({guildID: message.guild.id});
        const prefix = guildConfig.get('prefix');
        const language = guildConfig.get('language');
        if(message.mentions.has(client.user)) return message.channel.send(translate(language, "cmd.prefixMessage", "`"+prefix+"`"));
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
                if(!command.globalStatus) return message.channel.send(translate(language, "cmd.globalStatus"));
                if(command.ownerOnly) {
                    if(!botOwners.includes(message.author.id)) return;
                } else {
                    command = await CommandConfig.findOne({guildID: message.guild.id, name: command.name});
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
                            requiredChannels: cmd.requiredChannels,
                            blockedChannels: cmd.blockedChannels,
                            requiredRoles: cmd.requiredRoles,
                            blockedRoles: cmd.blockedRoles,
                            cooldownStatus: cmd.cooldownStatus,
                            cooldown: cmd.cooldown,
                            cooldownPermissions: cmd.cooldownPermissions,
                            cooldownChannels: cmd.cooldownChannels,
                            cooldownRoles: cmd.cooldownRoles,
                            cooldownReminder: cmd.cooldownReminder,
                        });
                    }
                }
                

                if(command.autoRemove) message.delete();

                if(helpArgs.includes(cmdArgs[0])) return sendHelp(client, command, message);
                
                if(!command.status) return;
                
                if(!checkPermissions(command.permissions, message.member)) return;
                
                if(command.requiredChannels.length !== 0 && !command.requiredChannels.includes(message.channel.id)) return;
                if(command.blockedChannels.length !== 0 && command.blockedChannels.includes(message.channel.id)) return;
                
                if(!checkReqRoles(command.requiredRoles, message.member)) return;
                if(!checkBlockRoles(command.blockedRoles, message.member)) return;
                
                if(!checkArgs(command.minArgs, command.maxArgs, cmdArgs.length)) return;
    
                if(command.cooldownStatus && ms(command.cooldown) > 0) {
                    if(checkcdPermissions(command.cooldownPermissions, message.member)) {
                        runCmd(client, message, cmd, cmdArgs, command.autoRemoveResponse);
                        return;
                    }
                    if(command.cooldownChannels.length !== 0 && command.cooldownChannels.includes(message.channel.id)) {
                        runCmd(client, message, cmd, cmdArgs, command.autoRemoveResponse);
                        return;
                    }
                    if(checkcdRoles(command.cooldownRoles, message.member)) {
                        runCmd(client, message, cmd, cmdArgs, command.autoRemoveResponse);
                        return;
                    }
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
    } catch(err) {
        console.log(err);
    }
}

const checkPermissions = (permissions, member) => {
    if(permissions.length === 0) return true;
    for(i=0; i<permissions.length; i++) {
        if(member.hasPermission(permissions[i])) return true;
    }
    // console.log(`Command Log -> Komenda nie została wykonana z powodu braku permisji`);
    return false;
};

const checkcdPermissions = (permissions, member) => {
    if(permissions.length === 0) return false;
    for(i=0; i<permissions.length; i++) {
        if(member.hasPermission(permissions[i])) return true;
    }
    return false;
};

const checkArgs = (min, max, argsLength) => {
    if(min === null) {
        min = 0;
    } 
    if(max === null) {
        max = argsLength;
    }
    if(argsLength >= min && argsLength <= max) return true;
    // console.log(`Command Log -> Komenda nie została wykonana z powodu nieodpowiedniej ilości argumentów`);
    return false;
};

const checkReqRoles = (requiredRoles, member) => {
    if(requiredRoles.length === 0) return true;
    for(let i = 0; i<requiredRoles.length; i++) {
        if(member.roles.cache.find(r => r.id === requiredRoles[i])) return true;
    }
    // console.log(`Command Log -> Komenda nie została wykonana z powodu braku wymaganej roli`);
    return false;
}

const checkcdRoles = (requiredRoles, member) => {
    if(requiredRoles.length === 0) return false;
    for(let i = 0; i<requiredRoles.length; i++) {
        if(member.roles.cache.find(r => r.id === requiredRoles[i])) return true;
    }
    return false;
}

const checkBlockRoles = (blockedRoles, member) => {
    if(blockedRoles.length === 0) return true;
    for(let i = 0; i<blockedRoles.length; i++) {
        if(member.roles.cache.find(r => r.id === blockedRoles[i])) return false;
    }
    return true;
}

const sendHelp = async (client, cmd, message) => {
    const helpCmd = client.commands.get('help');
    await helpCmd.run(client, message, [cmd.name]);
}

const runCmd = async (client, message, cmd, cmdArgs, autoRemoveResponse) => {
    await cmd.run(client, message, cmdArgs);
    if(autoRemoveResponse && client.user.lastMessage) {
        client.user.lastMessage.delete({timeout: 5000});
    }
    cmdTriggerLog(client, cmd.name, message.guild, message.channel.id, message.author, message.content);
}

module.exports = {commandHandle};