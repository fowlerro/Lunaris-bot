const AutoRole = require("../database/schemas/AutoRole");
const ms = require('ms');
const AutoRoleTime = require("../database/schemas/AutoRoleTime");

async function giveAutoRole(member) {
    const config = await AutoRole.findOne({guildId: member.guild.id}); //TODO: Fetch data at client ready
    if(config) {
        const roles = config.get('roles');
        for(const element of roles) {
            member.roles.add(element.roleId).catch(err => console.log(err));
            let collection = await AutoRoleTime.findOne({guildId: member.guild.id, userId: member.id}).catch(err => console.log(err));
            if(collection) {
                if(!element.time) return;
                if(collection.roles.find(e => e.roleId === element.roleId)) return;
                await collection.updateOne({
                    $push: {roles: {roleId: element.roleId, timestamp: Date.now() + ms(element.time)}},
                }).catch(err => console.log(err));
            } else {
                if(!element.time) return;
                await AutoRoleTime.create({
                    guildId: member.guild.id,
                    userId: member.id,
                    roles: [{roleId: element.roleId, timestamp: Date.now() + ms(element.time)}],
                }).catch(err => console.log(err));
            }

            if(element.time) {
                setTimeout(async () => {
                    member.roles.remove(element.roleId).catch(err => console.log(err));
                    let collection = await AutoRoleTime.findOneAndUpdate({guildId: member.guild.id, userId: member.id}, {
                        $pull: {
                            roles: { roleId: element.roleId }
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
        const guild = client.guilds.cache.get(collection.guildId)
        const member = guild.members.cache.get(collection.userId)
        for (const role of collection.roles) {
            if(role.timestamp < Date.now()) {
                member.roles.remove(role.roleId).catch(err => console.log(err));
                const coll = await AutoRoleTime.findOneAndUpdate({guildId: collection.guildId, userId: collection.userId}, {
                    $pull: {
                        roles: { roleId: role.roleId }
                    }
                }, {new: true}).catch(err => console.log(err));
                if(!coll.roles.length) {
                    coll.delete().catch(err => console.log(err));
                }
            } else {
                setTimeout(async () => {
                    member.roles.remove(role.roleId).catch(err => console.log(err));
                    const coll = await AutoRoleTime.findOneAndUpdate({guildId: collection.guildId, userId: collection.userId}, {
                        $pull: {
                            roles: { roleId: role.roleId }
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