import { CommandInteraction } from "discord.js";
import BaseModule from "../../utils/structures/BaseModule";

class CommandsModule extends BaseModule {
    constructor() {
      	super('Commands', true);
    }

    async run() {
      	console.log(this.getName())
    }

    async handle(interaction: CommandInteraction) {
        const { commandName } = interaction

        const command = client.commands.get(commandName)
        if(!command) return

        command.run(interaction)
    }
}

export default new CommandsModule()