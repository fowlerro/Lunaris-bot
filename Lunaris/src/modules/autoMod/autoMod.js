
function censor(client, guildID, message, user) {
    const config = client.autoModConfigs.get(guildID);
    const trigger = config.censor.triggerValue;
    const words = config.censor.words;
    if(words.some((v) => message.content.indexOf(v) >= 0)) {
        const userID = user.id;
        const time = Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: 'numeric' }).format(new Date());
        let userCounts = client.autoModUsers.get(userID);
        let count;
        if(userCounts) count = userCounts[time];
        if(count) client.autoModUsers.set(userID, {...userCounts, [time]: count+1}); else client.autoModUsers.set(userID, {...userCounts, [time]: 1});
        console.log(time, client.autoModUsers.get(userID)[time]);
        console.log(time, client.autoModUsers.get(userID));
        const countLen = Object.keys(client.autoModUsers.get(userID)).length;
        
        if(countLen > 5) {
            for(const i in client.autoModUsers.get(userID)) {
                delete client.autoModUsers.get(userID)[i];
                break;
            }
        }
        const avg = (Object.values(client.autoModUsers.get(userID)).reduce((a, b) => a + b, 0)) / (Object.values(client.autoModUsers.get(userID)).length);
        if(avg >= trigger) {
            message.delete();
            if(avg >= trigger*2) {
                message.reply("Zostałeś ostrzeżony!");
            }
        }
        console.log(time, client.autoModUsers.get(userID));
    }
}

module.exports = {censor};