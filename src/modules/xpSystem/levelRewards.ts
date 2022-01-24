import { GuildProfileDocument } from "../../database/schemas/GuildProfile";
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

    const guild = await client.guilds.fetch(profile.guildId).catch((e) => {console.log(e)})
    if(!guild) return
    const member = await guild.members.fetch(profile.userId).catch((e) => {console.log(e)})
    if(!member) return
    const language = guild.preferredLocale === 'pl' ? 'pl' : 'en'

    rewardsAtLevel.forEach(async reward => {
        if(!reward.roleId) return

        const role = await guild.roles.fetch(reward.roleId).catch((e) => {console.log(e)})
        if(!role) return
        await member.roles.add(role, t('modules.level.rewardRoleAddReason', language)).catch((e) => {console.log(e)})
    })

    if(rewardsAtLevel.some(reward => reward.takePreviousRole)) {
        const rewardsBelowLevel = rewards.filter(reward => reward.level < profileLevel)
        if(!rewardsBelowLevel.length) return
        const rewardsLevelToTake = Math.max.apply(Math, rewardsBelowLevel.map(reward => reward.level))
        const rewardsToTake = rewardsBelowLevel.filter(reward => reward.level === rewardsLevelToTake)
        if(!rewardsToTake.length) return
        rewardsToTake.forEach(async reward => {
            if(!reward.roleId) return

            const role = await guild.roles.fetch(reward.roleId).catch((e) => {console.log(e)})
            if(!role) return
            await member.roles.remove(role, t('modules.level.rewardRoleRemoveReason', language)).catch((e) => {console.log(e)})
        })
    }
}