const {ChartJSNodeCanvas} = require('chartjs-node-canvas');
const { translate } = require('../utils/languages/languages');
const GuildConfig = require('../database/schemas/GuildConfig');
const { MessageAttachment } = require('discord.js');
const { palette } = require("../utils/utils");
const { daysInMonth } = require('../utils/utils');

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const messageChart = async (client, guild) => {
    const guildConfig = await GuildConfig.findOne({guildId: guild.id}).catch();
    const logChannel = guild.channels.cache.find(channel => channel.id === guildConfig.get('modules.stats.channel'));
    const language = guildConfig.get('language');
    if(!logChannel) return;

    const labels = [];
    const labelsData = client.msgCount.get(guild.id) || null;
    const labelsArr = [];
    let startDay = new Date().getDay()+1;
    const year = new Date().getFullYear();
    let day = new Date().getDate();
    if(day < 10) day = `0${day}`;
    let month = new Date().getMonth()+1;
    if(month < 10) month = `0${month}`;
    for (let i = 1; i <= 7; i++) {
        if(startDay == 1) startDay = 7; else startDay -= 1;
        labels.push(translate(language, `date.days.${days[startDay-1]}`));
        labelsArr.push(labelsData[`${day}${month}`] || 0);
        if(Number(day) === 1) {
            if(Number(month) === 1) month = 12; else month--;
            if(month < 10) month = `0${month}`;
            day = daysInMonth(Number(month), year);
        } else {
            day--;
            if(day < 10) day = `0${day}`;
        }
    }
    

    const chartCallback = (ChartJS) => {

        // Global config example: https://www.chartjs.org/docs/latest/configuration/
        ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
        ChartJS.defaults.global.defaultFontColor = '#dcddde';
        ChartJS.defaults.global.defaultFontSize = 20;
        // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
        ChartJS.plugins.register({
            afterDraw: function(chartInstance) {
                if (chartInstance.config.options.showDatapoints) {
                  var helpers = ChartJS.helpers;
                  var ctx = chartInstance.chart.ctx;
                  var fontColor = helpers.getValueOrDefault(chartInstance.config.options.showDatapoints.fontColor, chartInstance.config.options.defaultFontColor);
            
                  // render the value of the chart above the bar
                  ctx.font = ChartJS.helpers.fontString(ChartJS.defaults.global.defaultFontSize, 'normal', ChartJS.defaults.global.defaultFontFamily);
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'bottom';
                  ctx.fillStyle = fontColor;
            
                  chartInstance.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        if(i === dataset.data.length-1) {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                            var scaleMax = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
                            var yPos = (scaleMax - model.y) / scaleMax >= 0.93 ? model.y + 20 : model.y - 5;
                            ctx.fillText(dataset.data[i], model.x-10, yPos);
                        } else {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                            var scaleMax = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
                            var yPos = (scaleMax - model.y) / scaleMax >= 0.93 ? model.y + 20 : model.y - 5;
                            ctx.fillText(dataset.data[i], model.x, yPos);
                        }
                    }
                  });
                }
            }
        });
        // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
        ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
            // chart implementation
        });
    };

    const chartJSNodeCanvas  = new ChartJSNodeCanvas({ width: 600, height: 300, chartCallback});
    (async () => {
        const configuration = {
            type: 'line',
            data: {
                labels: labels.reverse(),
                datasets: [{
                    label: 'Wiadomości',
                    data: labelsArr.reverse(),
                    borderColor: palette.primary,
                    borderWidth: 4,
                    pointBackgroundColor: '#ff0000',
                    fill: false,
                    lineTension: 0,
                }]
            },
            options: {
                showDatapoints: true,
                legend: {
                    labels: {
                        fontColor: '#dcddde',
                        fontSize: 30,
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            fontSize: 20,
                            stepSize: 10,
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 20
                        }
                    }]
                }
            }
        }
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        const attachment = new MessageAttachment(image, 'chart.png');

        logChannel.send(attachment);
    })();

    
}

module.exports = {messageChart};