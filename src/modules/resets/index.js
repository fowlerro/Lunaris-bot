const cron = require('node-cron');
const xpSystem = require('../xpSystem');

module.exports = {
    name: "Resets",
    enabled: true,
    async run(client) {
        daily(client);
    }
}

async function dailyReset(client) {
    console.log(new Date().toLocaleString('pl-PL'), 'Daily reset');
    await xpSystem.resetDailyXp(client);
}

function daily(client) {
    cron.schedule('0 0 * * *', (() => {
        dailyReset(client);
    }),
    {
        scheduled: true,
        timezone: "Europe/Warsaw"
    });
}