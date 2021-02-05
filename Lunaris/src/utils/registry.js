
const path = require('path');
const fs = require('fs').promises;
const BaseEvent = require('./structures/BaseEvent');
const { reviver, JSONToMap } = require('./utils');
const mongoose = require('mongoose');
const GuildConfig = require('../database/schemas/GuildConfig');

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

module.exports = { 
  registerCommands, 
  registerEvents,
  registerMessagesCount,
  registerGuildConfigs,
};