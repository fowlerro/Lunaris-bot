
import { Permissions, Snowflake } from 'discord-api-types';
import { Message } from 'discord.js';
import DiscordClient from '../../types/client';

interface CommandDescription {
    pl: string
    en: string
}
interface CommandSyntax {
    pl: string
    en: string
}

export default interface Command {
    name: string
    aliases: Array<string>
    ownerOnly: boolean
    minArgs: number | null
    maxArgs: number | null
    autoRemove: boolean
    autoRemoveResponse: boolean
    globalStatus: boolean
    status: boolean

    description: CommandDescription
    category: string
    syntax: CommandSyntax
    syntaxExample: string

    permissions: Array<Permissions>
    allowedChannels: Array<Snowflake>
    blockedChannels: Array<Snowflake>
    allowedRoles: Array<Snowflake>
    blockedRoles: Array<Snowflake>

    cooldownStatus: boolean
    cooldown: string
    cooldownPermissions: Array<Permissions>
    cooldownChannels: Array<Snowflake>
    cooldownRoles: Array<Snowflake>
    cooldownReminder: boolean

    run: (client: DiscordClient, message: Message, args: Array<string> | null) => Promise<void>
}