const { MessageEmbed } = require("discord.js");
const { palette } = require("../../utils/utils");
const { translate } = require("../../utils/languages/languages");
const { Warn } = require("./utils");

async function censor(client, guildId, message, user) {
    const { language } = client.guildConfigs.get(message.guild.id);
    const autoModConfig = client.autoModConfigs.get(guildId);
    const trigger = autoModConfig.censor.triggerValue;
    const words = autoModConfig.censor.words;
    if(words.some((v) => message.content.toLowerCase().indexOf(v.toLowerCase()) >= 0)) { // If message contains banned word
        let userSwearCount = client.autoModUsers.get(`${user.id}_${message.guild.id}`);
        if(!userSwearCount) userSwearCount = 1; else userSwearCount++;
        client.autoModUsers.set(`${user.id}_${message.guild.id}`, userSwearCount);
        console.log(userSwearCount);
        
        if(userSwearCount >= trigger) {

            const warns = await Warn.list(client, message.guild.id, user.id); // Change Warn.list() function to return objects instead of strings;
            console.log(warns);

            const reason = `profanity abuse`;
            const warnExecutor = `AutoMod System`;
            const warn = await Warn.add(client, message.guild.id, user.id, reason, warnExecutor);
            if(!warn) return;

            const embed = new MessageEmbed()
                .setColor(palette.error)
                .setDescription(translate(language, 'autoMod.warn.addWarn', `<@${user.id}>`, `**${warnExecutor}**`, reason.length ? `| ${reason}` : ""));

            message.channel.send({embeds: [embed]});
            console.log(user.user.tag, 'censor trigger');
        }
        setTimeout(() => {
            client.autoModUsers.set(`${user.id}_${message.guild.id}`, userSwearCount--);
        }, 30000);
    }
}

module.exports = {censor};