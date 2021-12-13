const { getConfig } = require("../Modules/Handlers/AddonHandler"),
    CommandHandler = require("../Modules/Handlers/CommandHandler"),
    EventHandler = require("../Modules/Handlers/EventHandler"),
    { SlashCommandBuilder } = require("@discordjs/builders"),
    Utils = require("../Modules/Utils"),
    { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    _name: "Test",
    _log: true,
    _author: {
        name: "Zorino",
        color: "#FFE400",
    },
    _priority: 1,
    _customConfigs: {
        main: {
            type: "yml",
            path: `./Addon_Configs/{addon-name}/Main.yml`,
            data: {
                Enabled: true,
                Permission: "@everyone",
            },
        },
        lang: {
            type: "json",
            path: `./Addon_Configs/{addon-name}/Lang.json`,
            data: {
                Message: {
                    Content: "👋 Hello from Lang",
                },
            },
        },
    },
};

module.exports.run = async (bot, customConfig) => {
    const { main: addonConfig, lang: addonLang } = customConfig;
    CommandHandler.set({
        name: "test",
        type: "test",
        commandData: {
            Description: "test",
            Usage: "test",
            Aliases: [],
            Permission: [],
            SlashCommand: {
                Enabled: true,
                Data: {
                    Name: "test",
                    Description: "test",
                    Options: [
                        {
                            Type: "User",
                            Name: "mention",
                            Description: "mention user :D",
                            Required: true,
                        },
                        {
                            Type: "String",
                            Name: "input",
                            Description: "input :D",
                            Choices: [
                                {
                                    Name: "Option 1",
                                    Value: "option_1",
                                },
                                {
                                    Name: "Option 2",
                                    Value: "option_2",
                                },
                            ],
                        },
                    ],
                },
            },
        },
        run: (bot, message, args, config) => {
            if (!Utils.hasRole(message.member, addonConfig.Permission, true)) {
                message.channel.send("no permission");
            } else {
                message.channel.send(
                    Utils.setupMessage(
                        {
                            configPath: addonLang.Message,
                            variables: [
                                ...Utils.userVariables(message.member, "user"),
                            ],
                        },
                        false
                    )
                );
            }
        },
        runSlash: (bot, interaction, options) => {
            if (
                !Utils.hasRole(interaction.member, addonConfig.Permission, true)
            ) {
                interaction.reply("no permission");
            } else {
                interaction.reply(
                    Utils.setupMessage(
                        {
                            configPath: addonLang.Message,
                            variables: [
                                ...Utils.userVariables(
                                    interaction.member,
                                    "user"
                                ),
                            ],
                        },
                        true
                    )
                );
            }
        },
    });
};
