require('dotenv').config();
const { Client } = require('discord.js');
const { registerCommands, registerEvents, registerMessagesCount, registerGuildConfigs, registerAutoModConfigs, registerMutes } = require('./utils/registry');
const { mapToObject } = require('./utils/utils');
const client = new Client();
const mongoose = require('mongoose');
const botOwners = ["313346190995619841"];
const fs = require('fs');
const path = require('path');
const { checkAutoRoles } = require('./modules/autoRole');

const palette = {
  primary: '#102693',
  secondary: '',
  success: '#7BDB27',
  info: '#3C9FFC',
  error: '#B71E13',
}

mongoose.connect(`mongodb+srv://dbUser:${process.env.DB_PASS}@cluster0.wsvos.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

(async () => {
  client.commands = new Map();
  client.events = new Map();
  client.guildConfigs = new Map();
  client.autoModConfigs = new Map();
  client.autoModUsers = new Map();
  client.msgCount = new Map();
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await registerGuildConfigs(client);
  await registerAutoModConfigs(client);
  await registerMessagesCount(client);
  await client.login(process.env.DISCORD_BOT_TOKEN);
  await checkAutoRoles(client);
  await registerMutes(client);
})();

function handle(signal) {
  let data = JSON.stringify(mapToObject(client.msgCount));
  const pathFile = path.join(__dirname, './database/statistics.json');
  fs.writeFileSync(pathFile, data);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);

module.exports = {botOwners, palette};