import path from 'path'
import fs from 'fs/promises'
import BaseEvent from './structures/BaseEvent'
const clientConfig = require('../database/config.json');

export async function registerCommands(dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerCommands(path.join(dir, file));
    if (file.endsWith('.js') || file.endsWith('.ts')) {
      const cmd = require(path.join(filePath, file));
      const cat = dir.split('/').slice(2);
      cmd.cat = cat;
      client.commands.set(cmd.name, cmd);
      cmd.aliases.forEach((alias: string) => {
        client.commands.set(alias, cmd);
      });
    }
  }
}

export async function registerEvents(dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) registerEvents(path.join(dir, file));
    if (file.endsWith('.ts')) {
      const { default: Event } = await import(path.join(dir, file))
      if (Event.prototype instanceof BaseEvent) {
        const event = new Event();
        client.events.set(event.getName(), event);
        client.on(event.getName(), event.run.bind(event));
      }
    }
  }
}

// async function registerModules(dir = '') {
//   const filePath = path.join(__dirname, dir);
//   const files = await fs.readdir(filePath);
//   for(const file of files) {
//     const stat = await fs.lstat(path.join(filePath, file));
//     if(stat.isDirectory()) registerModules(client, path.join(dir, file));
//     if(file === 'index.js') {
//       const Module = require(path.join(filePath, file));
//       client.modules.set(Module.name, Module.enabled);
//       Module.run(client);
//       // console.log(Module.name);
//     }
//   }
// }

// function registerPresence() {
//   client.user.setPresence({
//     status: clientConfig.presence.status || 'online',
//     activities: [{
//       name: clientConfig.presence.activity.name || '',
//       type: clientConfig.presence.activity.type || 'PLAYING',
//     }]
//   })
// }

// module.exports = { 
//   registerCommands, 
//   registerEvents,
//   registerModules,
//   registerPresence
// };