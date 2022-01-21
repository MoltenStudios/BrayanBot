const Discord = require("discord.js"),
    Utils = require("../../Modules/Utils"),
    { lang, config, commands } = require("../../index"),
    { SlashCommandBuilder } = Utils.builder;

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
    let user = Utils.parseUserFromMessage(message, args[0]);
    message.channel.send(
        Utils.setupMessage({
            configPath: lang.General.UserInfo,
            variables: [
                ...Utils.userVariables(user),
                ...Utils.botVariables(bot),
            ],
        })
    );
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Interaction} interaction
 */
module.exports.runSlash = async (bot, interaction) => {
    let interactionUser = interaction.options.getUser("user");
    const user = interactionUser
        ? Utils.parseUser(interactionUser.id, interaction.guild)
        : interaction.member;   
    interaction.reply(
        Utils.setupMessage(
            {
                configPath: lang.General.UserInfo,
                variables: [
                    ...Utils.userVariables(user),
                    ...Utils.botVariables(bot),
                ],
            },
            true
        )
    );
};
