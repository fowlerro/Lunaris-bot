import { CommandInteraction } from "discord.js";

import add from "./add";
import remove from "./remove";
import list from "./list";

export default async (interaction: CommandInteraction) => {
    const subcommand = interaction.options.getSubcommand(true)

    if(subcommand === 'add') return add(interaction)
    if(subcommand === 'remove') return remove(interaction)
    if(subcommand === 'list') return list(interaction)
}