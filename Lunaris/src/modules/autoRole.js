const AutoRole = require("../database/schemas/AutoRole");
const ms = require('ms');
const AutoRoleTime = require("../database/schemas/AutoRoleTime");

async function giveAutoRole(member) {
    const config = await AutoRole.findOne({guildID: member.guild.id});
    if(config) {
        const roles = config.get('roles');
        for(const element of roles) {
            member.roles.add(element.roleID).catch(err => console.log(err));
            let collection = await AutoRoleTime.findOne({guildID: member.guild.id, userID: member.id}).catch(err => console.log(err));
            if(collection) {
                if(!element.time) return;
                if(collection.roles.find(e => e.roleID === element.roleID)) return;
                await collection.updateOne({
                    $push: {roles: {roleID: element.roleID, timestamp: Date.now() + ms(element.time)}},
                }).catch(err => console.log(err));
            } else {
                if(!element.time) return;
                await AutoRoleTime.create({
                    guildID: member.guild.id,
                    userID: member.id,
                    roles: [{roleID: element.roleID, timestamp: Date.now() + ms(element.time)}],
                }).catch(err => console.log(err));
            }

            if(element.time) {
                setTimeout(async () => {
                    member.roles.remove(element.roleID).catch(err => console.log(err));
                    let collection = await AutoRoleTime.findOneAndUpdate({guildID: member.guild.id, userID: member.id}, {
                        $pull: {
                            roles: {roleID: element.roleID}
                        }
                    }, {new: true});
                    if(!collection.roles.length) {
                        collection.delete();
                    }

                }, ms(element.time))
            }
        };
    }
}

async function checkAutoRoles(client) {
    const collections = await AutoRoleTime.find({});
    for (const collection of collections) {
        const guild = client.guilds.cache.get(collection.guildID)
        const member = guild.members.cache.get(collection.userID)
        for (const role of collection.roles) {
            if(role.timestamp < Date.now()) {
                member.roles.remove(role.roleID).catch(err => console.log(err));
                const coll = await AutoRoleTime.findOneAndUpdate({guildID: collection.guildID, userID: collection.userID}, {
                    $pull: {
                        roles: {roleID: role.roleID}
                    }
                }, {new: true}).catch(err => console.log(err));
                if(!coll.roles.length) {
                    coll.delete().catch(err => console.log(err));
                }
            } else {
                setTimeout(async () => {
                    member.roles.remove(role.roleID).catch(err => console.log(err));
                    const coll = await AutoRoleTime.findOneAndUpdate({guildID: collection.guildID, userID: collection.userID}, {
                        $pull: {
                            roles: {roleID: role.roleID}
                        }
                    }, {new: true}).catch(err => console.log(err));
                    if(!coll.roles.length) {
                        coll.delete().catch(err => console.log(err));
                    }
                }, role.timestamp - Date.now())
            }
        }
    }
}

module.exports = {giveAutoRole, checkAutoRoles};