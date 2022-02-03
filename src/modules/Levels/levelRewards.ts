import { GuildProfileDocument } from "../../database/schemas/GuildProfile";
import { getLocale } from "../../utils/utils";

import xpSystem from './index'

export default async (profile: GuildProfileDocument, isText: boolean) => {
    const scope = isText ? 'text' : 'voice'
    const levelConfig = await xpSystem.get(profile.guildId)
    if(!levelConfig) return
    const profileLevel = profile.statistics[scope].level
    const rewards = levelConfig.rewards[scope]
    if(!rewards.length) return
    
    const rewardsAtLevel = rewards.filter(reward => reward.level === profileLevel)
    if(!rewardsAtLevel.length) return

    const guild = await client.guilds.fetch(profile.guildId).catch(logger.error)
    if(!guild) return
    const member = await guild.members.fetch(profile.userId).catch(logger.error)
    if(!member) return
    const language = getLocale(guild.preferredLocale)

    rewardsAtLevel.forEach(async reward => {
        if(!reward.roleId) return

        const role = await guild.roles.fetch(reward.roleId).catch(logger.error)
        if(!role) return
        await member.roles.add(role, t('modules.level.rewardRoleAddReason', language)).catch(logger.error)
    })

    if(rewardsAtLevel.some(reward => reward.takePreviousRole)) {
        const rewardsBelowLevel = rewards.filter(reward => reward.level < profileLevel)
        if(!rewardsBelowLevel.length) return
        const rewardsLevelToTake = Math.max.apply(Math, rewardsBelowLevel.map(reward => reward.level))
        const rewardsToTake = rewardsBelowLevel.filter(reward => reward.level === rewardsLevelToTake)
        if(!rewardsToTake.length) return
        rewardsToTake.forEach(async reward => {
            if(!reward.roleId) return

            const role = await guild.roles.fetch(reward.roleId).catch(logger.error)
            if(!role) return
            await member.roles.remove(role, t('modules.level.rewardRoleRemoveReason', language)).catch(logger.error)
        })
    }
}