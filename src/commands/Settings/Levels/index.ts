import { AutocompleteInteraction, CommandInteraction, Permissions } from "discord.js";

import BaseCommand from "../../../utils/structures/BaseCommand";
import levelUpChannel from "./levelUpChannel";
import levelUpMessage from "./levelUpMessage";
import multiplier from "./multiplier";
import rewards from "./rewards";
import { removeAutocomplete } from "./rewards/remove";

export default class LevelCommand extends BaseCommand {
    constructor() {
        super(
            'level',
            'CHAT_INPUT',
            {
                en: "Manage Level Module",
                pl: 'Zarządzanie modułem poziomów'
            },
            [
                {
                    name: 'config',
                    description: "Manage Levels config",
                    type: 'SUB_COMMAND_GROUP',
                    options: [
                        {
                            name: 'level-up-message',
                            description: "Set custom level up message, not providing format argument will remove custom message",
                            type: 'SUB_COMMAND',
                            options: [
                                {
                                    name: 'format',
                                    description: 'Format of the level up message, you can use the formatters here /formatters',
                                    type: 'STRING',
                                }
                            ]
                        },
                        {
                            name: 'level-up-channel',
                            description: "Change way the bot will send level up message",
                            type: 'SUB_COMMAND',
                            options: [
                                {
                                    name: 'mode',
                                    description: "Mode allows you to choose one out of three options",
                                    type: 'STRING',
                                    choices: [{ name: 'disable', value: 'off' }, { name: 'Current channel - Channel where user gets level', value: 'currentChannel' }, { name: "Specific Channel - Choose channel to gets level up messages always in one place", value: 'specificChannel' }]
                                },
                                {
                                    name: 'channel',
                                    description: "Channel for the last mode",
                                    type: 'CHANNEL',
                                    channelTypes: [ 'GUILD_TEXT' ]
                                }
                            ]
                        },
                        {
                            name: 'multiplier',
                            description: "Set xp multiplier, or display current setting, when value not provided",
                            type: 'SUB_COMMAND',
                            options: [
                                {
                                    name: 'value',
                                    description: "Default is 1 (20-35xp per message)",
                                    type: 'NUMBER',
                                    minValue: 0.01,
                                    maxValue: 5
                                }
                            ]
                        },
                    ]
                },
                {
                    name: 'rewards',
                    description: "Manage Level Rewards",
                    type: 'SUB_COMMAND_GROUP',
                    options: [
                        {
                            name: 'add',
                            description: "Add new Level Reward",
                            type: 'SUB_COMMAND',
                            options: [
                                {
                                    name: 'role',
                                    description: "Role to be added, when user gets specific level",
                                    type: 'ROLE',
                                    required: true
                                },
                                {
                                    name: 'level',
                                    description: "At which level this rewards should be given",
                                    type: 'INTEGER',
                                    minValue: 1,
                                    required: true
                                },
                                {
                                    name: 'scope',
                                    description: "If level is text or voice",
                                    type: 'STRING',
                                    choices: [{ name: 'text', value: 'text' }, { name: 'voice', value: 'voice' }],
                                    required: true
                                },
                                {
                                    name: 'remove-previous-reward',
                                    description: "This option allows to remove role from previous reward, this works only for last reward",
                                    type: 'BOOLEAN'
                                }
                            ]
                        },
                        {
                            name: 'remove',
                            description: "Remove an existing Level Reward",
                            type: 'SUB_COMMAND',
                            options: [
                                {
                                    name: 'scope',
                                    description: "If a reward is text or voice",
                                    type: 'STRING',
                                    choices: [{ name: 'text', value: 'text' }, { name: 'voice', value: 'voice' }],
                                    required: true
                                },
                                {
                                    name: 'reward',
                                    description: "A reward to be removed",
                                    type: 'STRING',
                                    autocomplete: true,
                                    required: true
                                }
                            ]
                        },
                        {
                            name: 'list',
                            description: "A list of added Level Rewards",
                            type: 'SUB_COMMAND',
                            options: [
                                {
                                    name: 'scope',
                                    description: "Display rewards for only text or voice",
                                    type: 'STRING',
                                    choices: [{ name: 'text', value: 'text' }, { name: 'voice', value: 'voice' }],
                                }
                            ]
                        }
                    ]
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId || !interaction.guild || !interaction.member) return
        if(!('id' in interaction.member)) return
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return
        
        const subcommandGroup = interaction.options.getSubcommandGroup()
        const subcommand = interaction.options.getSubcommand(true)

        if(subcommandGroup === 'rewards') return rewards(interaction)

        if(subcommand === 'level-up-message') return levelUpMessage(interaction)
        if(subcommand === 'level-up-channel') return levelUpChannel(interaction)
        if(subcommand === 'multiplier') return multiplier(interaction)
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        return removeAutocomplete(interaction)
    }
}