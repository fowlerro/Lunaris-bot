import BaseModule from "../../utils/structures/BaseModule";

class CommandsModule extends BaseModule {
    constructor() {
      super('Commands', true);
    }

    async run() {
      console.log(this.getName())
    }
}

export default new CommandsModule()