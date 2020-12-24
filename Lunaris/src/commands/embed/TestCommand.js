const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class TestCommand extends BaseCommand {
  constructor() {
    super('user', 'testing', []);
  }

  async run(client, message, args) {

    const embed = MessageEmbed()
      .setAuthor(message.user.username);
    
    message.channel.send(embed);
  }
}