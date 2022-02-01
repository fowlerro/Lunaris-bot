import BaseModule from "../../utils/structures/BaseModule"

import { Ban, registerBans } from "./ban"
import { Mute } from "./mute"
import { Warn } from "./warn"

class ModModule extends BaseModule {
    constructor() {
        super('Mod', true)
    }

    async run() {
        console.log(this.getName())
        await registerBans()
    }

    warn = Warn
    mute = Mute
    ban = Ban
}

export default new ModModule()