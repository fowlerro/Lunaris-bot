import express from 'express'

import { getBotGuilds, getRolesFromGuild, getUserGuilds } from '../utils/api';
import { getGuilds } from '../utils/utils';
import Guilds from '../../modules/Guilds';
import Embeds from '../../modules/Embeds';

import { localeList } from '../../utils/languages/languages'
import { ReactionRoleModel } from '../../database/schemas/ReactionRoles';
import { ReactionRoleFormValues } from 'types';
import reactionRoles from '../../modules/reactionRoles';

const router = express.Router()

router.get('/guilds', async (req, res) => {
    if(req.user) {
        const guilds = await getBotGuilds()
        const userGuilds = await getUserGuilds(req.user.discordId);
        const mutualGuilds = getGuilds(userGuilds, guilds);
        res.send(mutualGuilds);
    } else {
        return res.status(401)
    }
});

router.get('/guilds/:guildId/settings', async (req, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params;

    if(!userId) return res.sendStatus(401)
    if(!guildId) return res.sendStatus(404)

    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(404)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    const clientMember = guild.me
    if(!clientMember) return res.sendStatus(404)

    const guildRoles = await guild.roles.fetch().catch(() => {})
    if(!guildRoles) return res.sendStatus(404)

    const guildConfig = await (await Guilds.config.get(guildId)).toObject()
    if(!guildConfig) res.sendStatus(404)
    return res.send({ clientMember, guildConfig, guildRoles: guildRoles.filter(role => role.name !== '@everyone' && !role.managed && role.editable) })
});

router.put('/guilds/:guildId/settings', async (req, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params

    const { language, nickname, muteRoleId } = req.body

    if(!userId) return res.sendStatus(401)
    if(!guildId) return res.sendStatus(404)

    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(404)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    const clientMember = guild.me
    if(!clientMember) return res.sendStatus(404)
    
    const guildConfig = await Guilds.config.get(guildId)
    if(!guildConfig) return res.sendStatus(404)

    const guildRoles = await guild.roles.fetch().catch(() => {})
    if(!guildRoles) return res.sendStatus(404)

    const muteRole = guildRoles.find(role => role.id === muteRoleId)
    const newMuteRoleId = muteRole ? muteRole.id : guildConfig.modules.autoMod.muteRole

    const newLanguage = localeList().includes(language) ? language : guildConfig.language

    const updatedGuildConfig = await (await Guilds.config.set(guildId, { language: newLanguage, 'modules.autoMod.muteRole': newMuteRoleId })).toObject()
    if(!updatedGuildConfig) return res.sendStatus(404)

    const updatedClientMember = await clientMember.setNickname(nickname)

    return res.send({ clientMember: updatedClientMember, guildConfig: updatedGuildConfig, guildRoles: guildRoles.filter(role => role.name !== '@everyone' && !role.managed && role.editable) })
})


router.get('/guilds/:guildId/reactionroles', async (req, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params;

    if(!userId) return res.sendStatus(401)
    if(!guildId) return res.sendStatus(404)

    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(404)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    const reactionRoles = await ReactionRoleModel.find({ guildId }).lean()

    const guildChannels = await guild.channels.fetch().catch(() => {})
    if(!guildChannels) return res.sendStatus(404)

    const guildTextChannels = guildChannels.filter(guild => guild.type === 'GUILD_CATEGORY' || guild.type === 'GUILD_TEXT')

    const guildRoles = await guild.roles.fetch().catch(() => {})
    if(!guildRoles) return res.sendStatus(404)

    const guildManagedRoles = guildRoles.filter(role => role.name !== '@everyone' && !role.managed && role.editable)

    return res.send({ reactionRoles, guildChannels: guildTextChannels, guildRoles: guildManagedRoles })
})

router.put('/guilds/:guildId/reactionroles', async (req, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params;

    const { channelId, messageType, messageId, reactions, buttons }: ReactionRoleFormValues = req.body

    if(!userId) return res.sendStatus(401)
    if(!guildId) return res.sendStatus(404)

    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(404)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    const channel = await guild.channels.fetch(channelId).catch(() => {})
    if(!channel || !channel.isText()) return res.sendStatus(404)

    const message = messageType === 'lastMessage' ? channel.lastMessage : await channel.messages.fetch(messageId).catch(() => {})
    if(!message) return res.sendStatus(404)

    await reactionRoles.create(guild.id, channel.id, message.id, reactions)
    

    return res.sendStatus(200)
})

router.get('/guilds/:guildId/roles', async (req, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params;
    const roles = await getRolesFromGuild(guildId);
    res.send(roles);
})

router.put('/guilds/:guildId/embed/send', async (req, res) => {
    const { guildId } = req.params
    const { channelId, embed } = req.body
    if(!channelId || !embed) return res.status(400).send({ "msg": "ChannelId required" })
    return Embeds.send(embed, guildId, channelId)
})

export default router