import { AutocompleteInteraction, CommandInteraction, MessageEmbed, Permissions } from "discord.js";

import BaseCommand from "../../../utils/structures/BaseCommand";
import { getLocale, palette } from "../../../utils/utils";
import type { Language } from "types";

import give from "./give";
import remove, { removeAutocomplete } from "./remove";
import list from "./list";
import { handleCommandError } from "../../errors";

export default class BanCommand extends BaseCommand {
    constructor() {
        super(
            'ban',
            'CHAT_INPUT',
            {
                en: "Bans user",
                pl: "Banuje użytkownika"
            },
            [
                {
                    name: 'give',
                    description: 'Gives the ban',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'member',
                            description: "Member to ban",
                            type: 'USER',
                            required: true
                        },
                        {
                            name: 'time',
                            description: "For how long the ban will be given, e.g. 1d 5h 30m 30s",
                            type: 'STRING'
                        },
                        {
                            name: 'reason',
                            description: "Reason for the ban",
                            type: 'STRING' // TODO Limit string length
                        },
                    ]
                },
                {
                    name: 'give-by-id',
                    description: "Gives the ban by the user's id",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'user-id',
                            description: "User's id to ban",
                            type: 'STRING',
                            required: true
                        },
                        {
                            name: 'time',
                            description: "For how long the ban will be given, e.g. 1d 5h 30m 30s",
                            type: 'STRING'
                        },
                        {
                            name: 'reason',
                            description: "Reason for the ban",
                            type: 'STRING' // TODO Limit string length
                        },
                    ]
                },
                {
                    name: 'remove',
                    description: "Removes the ban by the user's id",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'user-id',
                            description: "User's id to ban",
                            type: 'STRING',
                            required: true,
                            autocomplete: true
                        },
                        {
                            name: 'reason',
                            description: "Reason for the unban",
                            type: 'STRING', // TODO Limit string length
                        },
                    ]
                },
                {
                    name: 'list',
                    description: 'Shows list of all bans in this server',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'page',
                            description: 'The page, which will be shown, in situation list of bans will be paginated',
                            type: 'INTEGER',
                            minValue: 1,
                        }
                    ]
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId || !interaction.member) return
        if(!('id' in interaction.member)) return
        if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return handleCommandError(interaction, 'command.executorWithoutPermission')
        
        const subcommand = interaction.options.getSubcommand(true)

        if(subcommand === 'give' || subcommand === 'give-by-id') return give(interaction)
        if(subcommand === 'remove') return remove(interaction)
        if(subcommand === 'list') return list(interaction)
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        return removeAutocomplete(interaction)
    }
}