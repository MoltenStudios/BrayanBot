const Discord = require("discord.js"),
    Utils = require("../../Modules/Utils"),
    { lang, config, commands } = require("../../index"),
    { SlashCommandBuilder } = require("@discordjs/builders"),
    moment = require("moment");

module.exports = {
    name: "avatar",
    type: "general",
    commandData: commands.General.Avatar,
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
    const avatar = user.user
        .displayAvatarURL({ dynamic: true })
        .endsWith("?size=2048")
        ? user.user.displayAvatarURL({ dynamic: true })
        : `${user.user.displayAvatarURL({ dynamic: true })}?size=2048`;

    message.channel.send(
        Utils.setupMessage({
            configPath: lang.General.Avatar,
            variables: [
                {
                    searchFor: /{link}/g,
                    replaceWith: user.user.displayAvatarURL({ dynamic: true }),
                },
                { searchFor: /{avatar}/g, replaceWith: avatar },
                ...Utils.userVariables(user, "req-user"),
                ...Utils.userVariables(message.member),
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
    const interactionUser = interaction.options.getUser("target");
    const user = interactionUser
        ? Utils.parseUser(interactionUser.id, interaction.guild)
        : interaction.member;
    const avatar = user.user
        .displayAvatarURL({ dynamic: true })
        .endsWith("?size=2048")
        ? user.user.displayAvatarURL({ dynamic: true })
        : `${user.user.displayAvatarURL({ dynamic: true })}?size=2048`;

    interaction.reply(
        Utils.setupMessage(
            {
                configPath: lang.General.Avatar,
                variables: [
                    {
                        searchFor: /{link}/g,
                        replaceWith: user.user.displayAvatarURL({
                            dynamic: true,
                        }),
                    },
                    { searchFor: /{avatar}/g, replaceWith: avatar },
                    ...Utils.userVariables(user, "req-user"),
                    ...Utils.userVariables(interaction.member),
                    ...Utils.botVariables(bot),
                ],
            },
            true
        )
    );
};
