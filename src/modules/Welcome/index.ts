import BaseModule from "../../utils/structures/BaseModule";

class WelcomeModule extends BaseModule {
    constructor() {
       super('Welcome', true)
    } 

    async run() {
            
    }

    async message() {
        
    }
}

export default new WelcomeModule()