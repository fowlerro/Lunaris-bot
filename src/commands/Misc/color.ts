import { CommandInteraction, Message, MessageAttachment, MessageEmbed } from "discord.js";
import { createCanvas } from 'canvas'

import BaseCommand from "../../utils/structures/BaseCommand";
import { colorFormatsType, convertColor, getLocale, palette, supportedColorFormats } from "../../utils/utils";
import { Language } from "types";

export default class ColorCommand extends BaseCommand {
    constructor() {
        super(
            'color',
            'CHAT_INPUT',
            {
                en: "Color converter/generator",
                pl: "Konwerter/generator kolorów"
            },
            [
                {
                    name: 'convert',
                    description: 'Converts colors',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'input-format',
                            description: "Color format, you wanna convert",
                            type: 'STRING',
                            choices: supportedColorFormats.map(format => ({ name: format, value: format })),
                            required: true
                        },
                        {
                            name: 'color',
                            description: "Color to convert",
                            type: 'STRING',
                            required: true
                        },
                        {
                            name: 'output-format',
                            description: "Color format, you wanna get",
                            type: 'STRING',
                            choices: supportedColorFormats.map(format => ({ name: format, value: format })),
                            required: true
                        },
                    ]
                },
                {
                    name: 'show',
                    description: 'Shows the color from value',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'input-format',
                            description: "Color format",
                            type: "STRING",
                            choices: supportedColorFormats.map(format => ({ name: format, value: format })),
                            required: true
                        },
                        {
                            name: 'color',
                            description: "Color to display",
                            type: 'STRING',
                            required: true
                        }
                    ]
                }
            ],
            true, true
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId || !interaction.member) return
        const language = getLocale(interaction.guildLocale)
        
        const subcommand = interaction.options.getSubcommand(true)

        if(subcommand === 'convert') {
            const inputFormat = interaction.options.getString('input-format', true) as colorFormatsType
            if(!supportedColorFormats.includes(inputFormat)) return incorrectFormat(interaction, language)
            const outputFormat = interaction.options.getString('output-format', true) as colorFormatsType
            if(!supportedColorFormats.includes(outputFormat)) return incorrectFormat(interaction, language)
            const color = interaction.options.getString('color', true)

            const convertedColor = convertColor(inputFormat, outputFormat, color)
            if(convertedColor instanceof Error) return invalidColor(interaction, language)
            
            const hexColor = convertColor(inputFormat, 'HEX', color) as `#${string}`

            const embed = new MessageEmbed()
                .setColor(hexColor)
                .setDescription(t('command.color.converted', language, { inputFormat, inputColor: color, outputFormat, outputColor: convertedColor.toString() }))

            return interaction.reply({
                embeds: [embed]
            }).catch(console.error)
        }

        if(subcommand === 'show') {
            const inputFormat = interaction.options.getString('input-format', true) as colorFormatsType
            if(!supportedColorFormats.includes(inputFormat)) return incorrectFormat(interaction, language)
            const color = interaction.options.getString('color', true)

            const hexColor = convertColor(inputFormat, 'HEX', color) as `#${string}` | Error
            if(hexColor instanceof Error) return invalidColor(interaction, language)
            const rgbColor = convertColor(inputFormat, 'RGB', color)
            const hsvColor = convertColor(inputFormat, 'HSV', color)
            const hslColor = convertColor(inputFormat, 'HSL', color)
            const cmykColor = convertColor(inputFormat, 'CMYK', color)

            const canvas = createCanvas(50, 50)
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = hexColor
            ctx.fillRect(0, 0, 50, 50)
            const attachment = new MessageAttachment(canvas.toBuffer('image/jpeg'), 'color.jpg')

            const description = 
                `**RGB:** \`${rgbColor}\`
                **HEX:** \`${hexColor}\`
                **HSV:** \`${hsvColor}\`
                **HSL:** \`${hslColor}\`
                **CMYK:** \`${cmykColor}\``

            const embed = new MessageEmbed()
                .setColor(hexColor)
                .setDescription(description)
                .setImage('attachment://color.jpg')

            return interaction.reply({
                files: [attachment],
                embeds: [embed],
            }).catch(console.error)
        }
    }
}

async function incorrectFormat(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.color.incorrectFormat', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    }).catch(console.error)
}

async function invalidColor(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.color.invalidColor', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    }).catch(console.error)
}
