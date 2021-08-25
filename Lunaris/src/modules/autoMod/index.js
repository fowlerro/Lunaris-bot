const GuildMembers = require("../../database/schemas/GuildMembers");
const { unmuteLog } = require("../guildLogs");
const Guilds = require("../Guilds");

module.exports = {
    name: "AutoMod",
    enabled: true,
    async run(client) {
        await registerMutes(client);
    },
}

async function registerMutes(client) {
    const collections = await GuildMembers.find({'muted.isMuted': true, 'muted.timestamp': { $ne: null }});
    for(const collection of collections) {
        const guild = await client.guilds.fetch(collection.guildId)
        const member = await guild.members.fetch(collection.userId)
        const guildConfig = await Guilds.config.get(client, guild.id);
        const muteRoleId = guildConfig.get('modules.autoMod.muteRole');
        const muteRole = guild.roles.cache.get(muteRoleId) || guild.roles.cache.find(r => r.name.toLowerCase() === 'muted' || r.name.toLowerCase() === 'mute');
        const hasRole = member.roles.cache.has(muteRole.id);
        if(collection.muted.timestamp < Date.now() || !hasRole) {
            await member.roles.remove(muteRole).catch(err => console.log(err));

            collection.muted = {
                isMuted: false,
                timestamp: null,
                date: null,
                reason: null,
                by: null
            }
            const muteInfo = await collection.save();
            return unmuteLog(client, guild.id, muteInfo.muted.by, 'System', member.id);
        }
        setTimeout(async () => {
            await member.roles.remove(muteRole).catch(e => console.log(e));
            collection.muted = {
                isMuted: false,
                timestamp: null,
                date: null,
                reason: null,
                by: null
            }
            const muteInfo = await collection.save();
            unmuteLog(client, guild.id, muteInfo.muted.by, 'System', member.id);
  
        }, collection.muted.timestamp - Date.now());
    }
}