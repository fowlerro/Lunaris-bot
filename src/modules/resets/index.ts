import cron from 'node-cron'

import BaseModule from "../../utils/structures/BaseModule";
import xpSystem from '../xpSystem';


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
    cron.schedule('1 0 * * *', (() => {
        dailyReset();
    }),
    {
        scheduled: true,
        timezone: "Europe/Warsaw"
    });
}

export default new ResetModule()