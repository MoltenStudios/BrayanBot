const Discord = require("discord.js"),
    Utils = require("../../Modules/Utils"),
    { lang, config, commands } = require("../../index"),
    { SlashCommandBuilder } = require("@discordjs/builders"),
    moment = require("moment");
    
// Receive client uptime in miliseconds 
// and break the number into days, hours, minutes and seconds
const duration = (ms) => {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (1000 * 60)) % 60).toString();
    const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
    return days.padStart(1, "0") + " " + "days" + " " +
        hrs.padStart(2, "0") + " " + "hours"  + " " +
        min.padStart(2, "0") + " " + "minutes" + " " +
        sec.padStart(2, "0") + " " + "seconds" + " ";
};

module.exports = {
    name: "uptime",
    type: "general",
    commandData: commands.General.Uptime,
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Array} args
 * @param {Object} config
 */
module.exports.run = async (bot, message, args, config) => {
    message.channel
        .send({
            embeds: [
                {
                    title: "Fetching uptime...",
                },
            ],
        })
        .then(async (msg) => {
            msg.delete();
            msg.channel.send(
                Utils.setupMessage({
                    configPath: lang.General.Uptime,
                    variables: [
                        ...Utils.userVariables(message.member),
                        ...Utils.botVariables(bot),
                        { searchFor: /{uptime}/g, replaceWith: duration(bot.uptime) },
                    ],
                })
            );
        });
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Interaction} interaction
 */
module.exports.runSlash = async (bot, interaction) => {
    interaction.reply(
        Utils.setupMessage(
            {
                configPath: lang.General.Uptime,
                variables: [
                    ...Utils.userVariables(interaction.member),
                    ...Utils.botVariables(bot),
                    { searchFor: /{uptime}/g, replaceWith: duration(bot.uptime) },
                ],
            },
            true
        )
    );
};
