
const path = require('path');
const fs = require('fs').promises;
const BaseEvent = require('./structures/BaseEvent');
const { JSONToMap, setActivity } = require('./utils');
const GuildConfig = require('../database/schemas/GuildConfig');
const AutoMod = require('../database/schemas/AutoMod');
const GuildMembers = require('../database/schemas/GuildMembers');
const { unmuteLog } = require('../modules/guildLogs');

async function registerCommands(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const cmd = require(path.join(filePath, file));
      client.commands.set(cmd.name, cmd);
      cmd.aliases.forEach((alias) => {
        client.commands.set(alias, cmd);
      });
    }
  }
}

async function registerEvents(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Event = require(path.join(filePath, file));
      if (Event.prototype instanceof BaseEvent) {
        const event = new Event();
        client.events.set(event.name, event);
        client.on(event.name, event.run.bind(event, client));
      }
    }
  }
}

async function registerMessagesCount(client) {
  const pathFile = path.join(__dirname, './../database/statistics.json')
  const json = await fs.readFile(pathFile);
  JSONToMap(client.msgCount, json);
}

async function registerGuildConfigs(client) {
  const configs = await GuildConfig.find({}).select('-_id -__v');
  configs.forEach(element => {
    const {guildID} = element;
    client.guildConfigs.set(guildID, element)
  });
}

async function registerAutoModConfigs(client) {
  const configs = await AutoMod.find({}).select('-_id -__v');
  configs.forEach(element => {
    const {guildID} = element;
    client.autoModConfigs.set(guildID, element);
  });
}

async function registerMutes(client) {
  try {
      const collections = await GuildMembers.find({'muted.state': true, 'muted.timestamp': { $ne: null }});
      for(const collection of collections) {
          const guild = client.guilds.cache.get(collection.guildID)
          const member = guild.members.cache.get(collection.userID)
          const guildConfig = client.guildConfigs.get(guild.id);
          const muteRoleID = guildConfig.get('modules.autoMod.muteRole');
          const muteRole = guild.roles.cache.get(muteRoleID) || guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
          if(collection.muted.timestamp < Date.now()) {
              await member.roles.remove(muteRole).catch(err => console.log(err));
              await GuildMembers.findOneAndUpdate({guildID: guild.id, userID: member.id}, {
                  muted: {
                      state: false,
                      timestamp: null,
                      date: null,
                      reason: null,
                      by: null,
                  }
              }, {upsert: true});
          } else {
              setTimeout(async () => {
                  await member.roles.remove(muteRole).catch(e => console.log(e));
                  const muteInfo = await GuildMembers.findOneAndUpdate({guildID: guild.id, userID: member.id}, {
                      muted: {
                          state: false,
                          timestamp: null,
                          date: null,
                          reason: null,
                          by: null,
                      }
                  }, {upsert: true});
                  unmuteLog(client, guild.id, muteInfo.muted.by, 'System', member.id);

              }, collection.muted.timestamp - Date.now());
          }
      }
  } catch(e) {
      console.log(e)
  }
}

function registerTerminalCommands(client) {
  try {
    const terminalStdin = process.openStdin();
    let sayChannel = null;
    let dmChannel = null;
    terminalStdin.addListener('data', res => {
      const terminalInput = res.toString().trim().split(/ +/g);
      const [command, ...args] = terminalInput;
      
      if(command === 'setChannel') {
        sayChannel = args[0];
      }

      if(command === 'setDMChannel') {
        dmChannel = args[0];
      }

      if(command === 'say') {
        if(!sayChannel) return console.log("Specify channel by 'setChannel' command!");

        client.channels.cache.get(sayChannel).send(args.join(" "))
      }

      if(command === 'dm') {
        if(!dmChannel) return console.log("Specify userID by 'setDMChannel' command!");

        client.users.cache.get(dmChannel).send(args.join(" "))
      }

      if(command === 'activity') {
        const [mode, ...activity] = args;
        setActivity(client, mode, activity.join(" "));
      }
    })
  } catch(e) {
    console.log(e)
  }
}

module.exports = { 
  registerCommands, 
  registerEvents,
  registerMessagesCount,
  registerGuildConfigs,
  registerAutoModConfigs,
  registerMutes,
  registerTerminalCommands
};