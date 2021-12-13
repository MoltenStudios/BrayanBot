const Discord = require("discord.js"),
    Utils = require("../../Modules/Utils"),
    { lang, config, commands } = require("../../index"),
    { SlashCommandBuilder } = require("@discordjs/builders"),
    moment = require("moment");

module.exports = {
    name: "help",
    type: "general",
    commandData: commands.General.Help,
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Array} args
 * @param {Object} config
 */
module.exports.run = async (bot, message, args, config) => {
    let cmds = bot.Commands.toJSON();
    if (!args[0]) {
        let _commands = {};
        cmds.forEach((x) => {
            if (!_commands[x.type.toLowerCase()]) {
                _commands[x.type.toLowerCase()] = [];
            }
            _commands[x.type.toLowerCase()].push(x);
        });
        _commands = Object.entries(_commands);

        let fields = [];
        for (let index = 0; index < _commands.length; index++) {
            const c = _commands[index];
            fields.push({
                Name: `${Utils.formatFirstLetter(c[0])} Commands`,
                Value: c[1]
                    .map((x) => `\`${config.Settings.Prefix}${x.name}\``)
                    .join(", "),
            });
        }
        message.reply(
            Utils.setupMessage(
                {
                    configPath: {
                        Embeds: [
                            {
                                Title: "💁‍♂️ Help Menu",
                                Description:
                                    "> User `-help <command>` to view more information about command",
                                Fields: fields,
                                Footer: "{user-tag}",
                                FooterTag: "{user-tag}",
                                Thumbnail: "{bot-pfp}",
                                Timestamp: true,
                            },
                        ],
                    },
                    variables: [
                        ...Utils.userVariables(message.member),
                        ...Utils.botVariables(bot),
                    ],
                },
                true
            )
        );
    } else {
        let command = args[0].toLowerCase(),
            cmd = cmds.find(
                (x) => x.name.toLowerCase() == command.toLowerCase()
            );
        if (cmd) {
            message.reply(
                Utils.setupMessage(
                    {
                        configPath: lang.General.Help,
                        variables: [
                            ...Utils.userVariables(message.member),
                            ...Utils.botVariables(bot),
                            {
                                searchFor: /{command-name}/g,
                                replaceWith: cmd.name,
                            },
                            {
                                searchFor: /{command-description}/g,
                                replaceWith: cmd.commandData.Description,
                            },
                            {
                                searchFor: /{command-usage}/g,
                                replaceWith: cmd.commandData.Usage,
                            },
                            {
                                searchFor: /{command-aliases}/g,
                                replaceWith:
                                    cmd.commandData.Aliases.length > 0
                                        ? cmd.commandData.Aliases.join(", ")
                                        : "None",
                            },
                            {
                                searchFor: /{command-isSlashEnabled}/g,
                                replaceWith: cmd.commandData.SlashCommand
                                    .Enabled
                                    ? "✅"
                                    : "❌",
                            },
                        ],
                    },
                    true
                )
            );
        } else {
            message.reply(
                Utils.setupMessage({
                    configPath: lang.General.Help,
                    variables: [
                        ...Utils.userVariables(message.member),
                        ...Utils.botVariables(bot),
                        {
                            searchFor: /{error}/g,
                            replaceWith: `Unable to find \`${command}\` command`,
                        },
                    ],
                })
            );
        }
    }
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Interaction} interaction
 */
module.exports.runSlash = async (bot, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    let cmds = bot.Commands.toJSON();
    let command = interaction.options.getString("command");
    if (!command) {
        let _commands = {};
        cmds.forEach((x) => {
            if (!_commands[x.type.toLowerCase()]) {
                _commands[x.type.toLowerCase()] = [];
            }
            _commands[x.type.toLowerCase()].push(x);
        });
        _commands = Object.entries(_commands);

        let fields = [];
        for (let index = 0; index < _commands.length; index++) {
            const c = _commands[index];
            fields.push({
                Name: `${Utils.formatFirstLetter(c[0])} Commands`,
                Value: c[1].map((x) => `\`/${x.name}\``).join(", "),
            });
        }
        interaction.editReply(
            Utils.setupMessage(
                {
                    configPath: {
                        Embeds: [
                            {
                                Title: "💁‍♂️ Help Menu",
                                Description:
                                    "> User `-help <command>` to view more information about command",
                                Fields: fields,
                                Footer: "{user-tag}",
                                FooterTag: "{user-tag}",
                                Thumbnail: "{bot-pfp}",
                                Timestamp: true,
                            },
                        ],
                    },
                    variables: [
                        ...Utils.userVariables(interaction.member),
                        ...Utils.botVariables(bot),
                    ],
                },
                true
            )
        );
    } else {
        let cmd = cmds.find(
            (x) => x.name.toLowerCase() == command.toLowerCase()
        );
        if (cmd) {
            interaction.editReply(
                Utils.setupMessage(
                    {
                        configPath: lang.General.Help,
                        variables: [
                            ...Utils.userVariables(interaction.member),
                            ...Utils.botVariables(bot),
                            {
                                searchFor: /{command-name}/g,
                                replaceWith: cmd.name,
                            },
                            {
                                searchFor: /{command-description}/g,
                                replaceWith: cmd.commandData.Description,
                            },
                            {
                                searchFor: /{command-usage}/g,
                                replaceWith: cmd.commandData.Usage,
                            },
                            {
                                searchFor: /{command-aliases}/g,
                                replaceWith:
                                    cmd.commandData.Aliases.length > 0
                                        ? cmd.commandData.Aliases.join(", ")
                                        : "None",
                            },
                            {
                                searchFor: /{command-isSlashEnabled}/g,
                                replaceWith: cmd.commandData.SlashCommand
                                    .Enabled
                                    ? "✅"
                                    : "❌",
                            },
                        ],
                    },
                    true
                )
            );
        } else {
            interaction.editReply(
                Utils.setupMessage({
                    configPath: lang.General.Help,
                    variables: [
                        ...Utils.userVariables(interaction.member),
                        ...Utils.botVariables(bot),
                        {
                            searchFor: /{error}/g,
                            replaceWith: `Unable to find \`${command}\` command`,
                        },
                    ],
                })
            );
        }
    }
};
