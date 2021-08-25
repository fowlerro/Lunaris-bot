const path = require('path');
const fs = require('fs').promises;
const BaseEvent = require('./structures/BaseEvent');
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
  registerPresence
};