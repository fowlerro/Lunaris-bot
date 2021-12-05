import cron from 'node-cron'
import BaseModule from "../../utils/structures/BaseModule";
const xpSystem = require('../xpSystem');


class ResetModule extends BaseModule {
    constructor() {
       super('Reset', true)
    } 

    async run() {
        daily()
    }
}

async function dailyReset() {
    console.log(new Date().toLocaleString('pl-PL'), 'Daily reset');
    await xpSystem.resetDailyXp();
}

function daily() {
    cron.schedule('0 0 * * *', (() => {
        dailyReset();
    }),
    {
        scheduled: true,
        timezone: "Europe/Warsaw"
    });
}

export default new ResetModule()