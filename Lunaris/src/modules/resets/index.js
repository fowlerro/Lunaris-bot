const cron = require('node-cron');
const xpSystem = require('../xpSystem');

module.exports = {
    name: "Resets",
    enabled: true,
    async run(client) {
        daily();
    }
}

async function dailyReset() {
    console.log(new Date().toLocaleString('pl-PL'), 'Daily reset');
    await xpSystem.resetDailyXp();
}

function daily() {
    cron.schedule('0 0 * * *', dailyReset,
    {
        scheduled: true,
        timezone: "Europe/Warsaw"
    });
}