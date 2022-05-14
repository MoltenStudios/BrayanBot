const Discord = require("discord.js"),
    Utils = require("../../Modules/Utils"),
    { lang, config, commands } = require("../../index"),
    { SlashCommandBuilder } = Utils.builder,
    moment = require("moment");

module.exports = {
    name: "serverinfo",
    type: "general",
    commandData: commands.General.ServerInfo,
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Array} args
 * @param {Object} config
 */
module.exports.run = async (bot, message, args, config) => {
    message.channel.send(Utils.setupMessage({
        configPath: lang.General.ServerInfo,
        variables: [
            ...Utils.userVariables(message.member),
            ...Utils.userVariables(Utils.parseUser(message.guild.ownerId, message.guild), "guild-owner"),
            ...Utils.botVariables(bot),
            ...Utils.guildVariables(message.guild, "guild"),
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
        configPath: lang.General.ServerInfo,
        variables: [
            ...Utils.userVariables(interaction.member),
            ...Utils.userVariables(Utils.parseUser(interaction.guild.ownerId, interaction.guild), "guild-owner"),
            ...Utils.botVariables(bot),
            ...Utils.guildVariables(interaction.guild, "guild"),
        ],
    }, true));
};