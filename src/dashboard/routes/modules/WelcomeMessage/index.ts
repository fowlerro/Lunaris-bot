import express, { Request } from 'express'
import WelcomeMessage from '../../../../modules/WelcomeMessage'

import type { WelcomeMessage as WelcomeMessageType, WelcomeMessageAction, WelcomeMessageFormat } from 'types'
import { WelcomeMessageModel } from '../../../../database/schemas/WelcomeMessage'
import { Snowflake } from 'discord.js'

const router = express.Router({ mergeParams: true })

router.get('/get', async (req: Request<{ guildId: string }>, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params
    if(!userId) return res.sendStatus(401)
    if(!guildId) return res.sendStatus(400)

    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(400)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    const welcomeMessageConfig = await WelcomeMessage.get(guildId)
    if(!welcomeMessageConfig) return res.sendStatus(500)

    return res.send(welcomeMessageConfig)
})

router.put('/update', async (req: Request<{ guildId: string }>, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params
    const { status, channels, formats }: WelcomeMessageType = req.body
    if(!userId) return res.sendStatus(401)
    if(!guildId) return res.sendStatus(400)


    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(400)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    if(typeof status !== 'boolean') return res.sendStatus(400)
    if(typeof channels.join !== 'string' || typeof channels.join !== null || (typeof channels.join === 'string' && channels.join.length !== 18)) return res.sendStatus(400)
    if(typeof channels.leave !== 'string' || typeof channels.leave !== null || (typeof channels.leave === 'string' && channels.leave.length !== 18)) return res.sendStatus(400)
    if(!Array.isArray(formats)) return res.sendStatus(400)
    // TODO Better formats validation

    const updated = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
        status, channels, formats
    }, { upsert: true, new: true }).catch(() => {})
    if(!updated) return res.sendStatus(500)

    await WelcomeMessage.setCache(updated)

    return res.send(updated.toObject())
})

router.put('/switch', async (req: Request<{ guildId: string }>, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params
    const { status }: { status: boolean } = req.body
    if(!userId) return res.sendStatus(401)
    if(!guildId || typeof status !== 'boolean') return res.sendStatus(400)

    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(400)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    const updated = await WelcomeMessage.get(guildId)
    if(!updated) return res.sendStatus(500)

    const saved = await WelcomeMessageModel.findOneAndUpdate({ guildId }, {
        status
    }, { new: true, upsert: true, runValidators: true }).catch(e => console.log(e))
    if(!saved) return res.sendStatus(500)

    await WelcomeMessage.setCache(saved)

    return res.sendStatus(204)
})

router.put('/add', async (req: Request<{ guildId: string }>, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params
    const { welcomeMessage }: { welcomeMessage: WelcomeMessageFormat } = req.body
    if(!userId) return res.sendStatus(401)
    if(!guildId) return res.sendStatus(400)
    if(!WelcomeMessage.supportedActions.includes(welcomeMessage.action)) return res.sendStatus(400)
    if(typeof welcomeMessage.message !== 'string') return res.sendStatus(400)

    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(400)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    const updated = await WelcomeMessage.add(guildId, welcomeMessage)
    if(!updated) return res.sendStatus(500)

    return res.sendStatus(204)
})

router.put('/delete', async (req: Request<{ guildId: string }>, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params
    const { welcomeMessage }: { welcomeMessage: WelcomeMessageFormat } = req.body
    if(!userId) return res.sendStatus(401)
    if(!guildId) return res.sendStatus(400)
    if(!WelcomeMessage.supportedActions.includes(welcomeMessage.action)) return res.sendStatus(400)
    if(typeof welcomeMessage.message !== 'string') return res.sendStatus(400)

    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(400)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    const updated = await WelcomeMessage.delete(guildId, welcomeMessage)
    if(!updated) return res.sendStatus(500)

    return res.sendStatus(204)
})

router.put('/channel', async (req: Request<{ guildId: string }>, res) => {
    const userId = req.user?.discordId
    const { guildId } = req.params
    const { action, channelId }: { action: WelcomeMessageAction, channelId: Snowflake | null } = req.body
    if(!userId) return res.sendStatus(401)
    if(!guildId) return res.sendStatus(400)
    if(!WelcomeMessage.supportedActions.includes(action)) return res.sendStatus(400)
    if(typeof channelId !== 'string' || typeof channelId !== null || (typeof channelId === 'string' && channelId.length !== 18)) return res.sendStatus(400)

    const guild = await client.guilds.fetch(guildId).catch(() => {})
    if(!guild) return res.sendStatus(400)
    const member = await guild.members.fetch(userId).catch(() => {})
    if(!member || !member.permissions.has('MANAGE_GUILD')) return res.sendStatus(401)

    const updated = await WelcomeMessage.set(guildId, action, channelId)
    if(!updated) return res.sendStatus(500)

    return res.sendStatus(204)
})

// TODO Edit welcome message


export default router