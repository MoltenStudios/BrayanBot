const Discord = require("discord.js"), ms = require("ms"),
    Utils = require("../../Modules/Utils"),
    { lang, config, commands } = require("../../index");


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
    message.reply(Utils.setupMessage({
        configPath: lang.General.Uptime,
        variables: [
            ...Utils.userVariables(message.member),
            ...Utils.botVariables(bot),
            { searchFor: /{uptime}/g, replaceWith: ms(bot.uptime, { long: true }) },
        ],
    }));
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Interaction} interaction
 */
module.exports.runSlash = async (bot, interaction) => {
    interaction.reply(Utils.setupMessage({
        configPath: lang.General.Uptime,
        variables: [
            ...Utils.userVariables(interaction.member),
            ...Utils.botVariables(bot),
            { searchFor: /{uptime}/g, replaceWith: ms(bot.uptime, { long: true }) },
        ],
    }));
};
