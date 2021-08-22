const cron = require('node-cron');
const { resetDailyXp } = require('../xpSystem/utils');

async function reset() {
    console.log(new Date().toUTCString(), 'Daily reset');
    await resetDailyXp();
}


function dailyResetHandler() {
    cron.schedule('0 0 * * *', reset,
    {
        scheduled: true,
        timezone: "Europe/Warsaw"
    });
}

module.exports = { dailyResetHandler }