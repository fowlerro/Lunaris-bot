import { AutocompleteInteraction, CommandInteraction, ContextMenuInteraction } from "discord.js";

import BaseModule from "../../utils/structures/BaseModule";

class CommandsModule extends BaseModule {
    constructor() {
      	super('Commands', true);
    }

    async run() {
      	logger.info(this.getName())
    }

    async handle(interaction: CommandInteraction | ContextMenuInteraction) {
        const { commandName } = interaction
        const command = client.commands.get(commandName)
        if(!command) return

        command.run(interaction).catch(logger.error)
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        const { commandName } = interaction

        const command = client.commands.get(commandName)
        if(!command) return

        command.autocomplete && command.autocomplete(interaction).catch(logger.error)
    }
}

export default new CommandsModule()