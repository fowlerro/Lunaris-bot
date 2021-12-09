import path from 'path'
import fs from 'fs/promises'

import BaseEvent from './structures/BaseEvent'
import BaseModule from './structures/BaseModule';
import BaseCommand from './structures/BaseCommand';

const clientConfig = require('../database/config.json');
const testGuildId = '533385524434698260'

export async function registerCommands(dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  const guild = await client.guilds.fetch('533385524434698260')
  if(!guild) return
  // await guild.commands.fetch()
  // guild.commands.cache.each(cmd => cmd.delete())
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if(stat.isDirectory()) registerCommands(path.join(dir, file));
    if(file.endsWith('.ts')) {
      const { default: Command } = await import(path.join(filePath, file))
      if(Command.prototype instanceof BaseCommand) {
        const command: BaseCommand = new Command()

        const commandOptions: any = {
          name: command.name,
          type: command.type,
          options: command.options,
          defaultPermission: command.defaultPermission
        }

        if(command.type === 'CHAT_INPUT') commandOptions.description = command.description.en

        guild.commands.create(commandOptions)
        client.commands.set(command.name, command)
      }
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

export async function registerModules(dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for(const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if(stat.isDirectory()) registerModules(path.join(dir, file));
    if(file === 'index.ts') {
      const { default: Module } = await import(path.join(filePath, file))
      if(Module instanceof BaseModule) {
        Module.run();
      }
    }
  }
}

export function registerPresence() {
  client.user?.setPresence({
    status: clientConfig.presence.status || 'online',
    activities: [{
      name: clientConfig.presence.activity.name || '',
      type: clientConfig.presence.activity.type || 'PLAYING',
    }]
  })
}