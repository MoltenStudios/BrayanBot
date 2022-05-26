const Discord = require("discord.js"),
    Utils = require("../../Modules/Utils"),
    { lang, config, commands } = require("../../index"),
    { SlashCommandBuilder } = Utils.builder,
    moment = require("moment");

module.exports = {
    name: "userinfo",
    type: "general",
    commandData: commands.General.UserInfo,
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Array} args
 * @param {Object} config
 */
module.exports.run = async (bot, message, args, config) => {
    const user = Utils.parseUserFromMessage(message, args[0] ? args[0] : message.author.id, true);
    message.channel.send(Utils.setupMessage({
        configPath: lang.General.UserInfo,
        variables: [
            ...Utils.userVariables(user),
            ...Utils.memberVariables(user),
            ...Utils.botVariables(bot),
        ],
    }));
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Interaction} interaction
 */
module.exports.runSlash = async (bot, interaction) => {
    const user = interaction.options.getUser("target") ? Utils.parseUser(interaction.options.getUser("target").id, interaction.guild) : interaction.member;
    interaction.reply(Utils.setupMessage({
        configPath: lang.General.UserInfo,
        variables: [
            ...Utils.userVariables(user),
            ...Utils.memberVariables(user),
            ...Utils.botVariables(bot),
        ],
    }, true));
};