const Discord = require("discord.js"),
    Utils = require("../../Modules/Utils"),
    { lang, config, commands } = require("../../index"),
    { SlashCommandBuilder } = require("@discordjs/builders"),
    moment = require("moment");

module.exports = {
    name: "ping",
    type: "general",
    commandData: commands.General.Ping,
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
                    title: "Calculating ping..",
                },
            ],
        })
        .then(async (msg) => {
            const ping = msg.createdTimestamp - message.createdTimestamp;
            msg.delete();
            msg.channel.send(
                Utils.setupMessage({
                    configPath: lang.General.Ping,
                    variables: [
                        ...Utils.userVariables(message.member),
                        ...Utils.botVariables(bot),
                        { searchFor: /{bot-latency}/g, replaceWith: ping },
                        {
                            searchFor: /{api-latency}/g,
                            replaceWith: bot.ws.ping,
                        },
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
                configPath: lang.General.Ping,
                variables: [
                    ...Utils.userVariables(interaction.member),
                    ...Utils.botVariables(bot),
                    { searchFor: /{bot-latency}/g, replaceWith: "Unknown" },
                    { searchFor: /{api-latency}/g, replaceWith: bot.ws.ping },
                ],
            },
            true
        )
    );
};
