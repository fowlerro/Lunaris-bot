import { AutocompleteInteraction, CommandInteraction, ContextMenuInteraction } from "discord.js";
import BaseModule from "../../utils/structures/BaseModule";

class CommandsModule extends BaseModule {
    constructor() {
      	super('Commands', true);
    }

    async run() {
      	console.log(this.getName())
    }

    async handle(interaction: CommandInteraction | ContextMenuInteraction) {
        const { commandName } = interaction
        const command = client.commands.get(commandName)
        if(!command) return

        command.run(interaction)
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        const { commandName } = interaction

        const command = client.commands.get(commandName)
        if(!command) return

        command.autocomplete && command.autocomplete(interaction)
    }
}

export default new CommandsModule()