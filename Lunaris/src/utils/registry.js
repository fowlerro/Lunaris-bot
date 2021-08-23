
const path = require('path');
const fs = require('fs').promises;
const BaseEvent = require('./structures/BaseEvent');
const { JSONToMap, setActivity } = require('./utils');
const GuildConfig = require('../database/schemas/GuildConfig');
const clientConfig = require('../database/config.json');

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

async function registerModules(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for(const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if(stat.isDirectory()) registerModules(client, path.join(dir, file));
    if(file === 'index.js') {
      const Module = require(path.join(filePath, file));
      client.modules.set(Module.name, Module.enabled);
      Module.run(client);
      console.log(Module.name);
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
    const { guildId } = element;
    client.guildConfigs.set(guildId, element)
  });
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

function registerPresence(client) {
  client.user.setPresence({
    status: clientConfig.presence.status || 'online',
    activities: [{
      name: clientConfig.presence.activity.name || '',
      type: clientConfig.presence.activity.type || 'PLAYING',
    }]
  })
}

module.exports = { 
  registerCommands, 
  registerEvents,
  registerModules,
  registerMessagesCount,
  registerGuildConfigs,
  registerTerminalCommands,
  registerPresence
};