require('dotenv').config();
const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');
const client = new Client();
const mongoose = require('mongoose');
const botOwners = ["313346190995619841"];

mongoose.connect('mongodb+srv://dbUser:JtwwkIEaZukU2SE6@cluster0.wsvos.mongodb.net/Lunaris?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

(async () => {
  client.commands = new Map();
  client.events = new Map();
  await registerCommands(client, '../commands');
  await registerEvents(client, '../events');
  await client.login(process.env.DISCORD_BOT_TOKEN);
})();

module.exports = {botOwners};