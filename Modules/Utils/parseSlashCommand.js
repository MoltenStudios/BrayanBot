const Discord = require("discord.js"),
    { MessageActionRow, MessageButton, MessageSelectMenu } = Discord,
    chalk = require("chalk");

const commandStructure = {
    Name: String,
    Description: String,
    Options: [
        {
            Type: String || Number,
            Name: String,
            Description: String,
            Required: Boolean,
            ChannelTypes: Array,
            Choices: [
                {
                    Name: String,
                    Value:
                        String ||
                        Number ||
                        Int8Array ||
                        Int16Array ||
                        Int32Array,
                },
            ],
        },
    ],
};
/**
 *
 * @param {commandStructure} data
 */
module.exports = (data) => {
    const Utils = require("../Utils");
    if (!data) {
        Utils.logError(
            `[Utils] [SlashCommandCreator] ${chalk.bold("Data")} not provided.`
        );
        return false;
    } else if (!data.Name) {
        Utils.logError(
            `[Utils] [SlashCommandCreator] A ${chalk.bold(
                "Name"
            )} is required to build Slash Command.`
        );
        return false;
    } else if (!data.Description) {
        Utils.logError(
            `[Utils] [SlashCommandCreator] A ${chalk.bold(
                "Description"
            )} is required to build Slash Command.`
        );
        return;
    } else {
        const { Name, Description, Options } = data;
        let command = {
            name: undefined,
            description: undefined,
            options: [],
            default_permission: undefined,
        };

        if (!Name)
            Utils.logError(
                `[Utils] [SlashCommandCreator] A ${chalk.bold(
                    "Name"
                )} is required to build Slash Command.`
            );
        if (!Description)
            Utils.logError(
                `[Utils] [SlashCommandCreator] A ${chalk.bold(
                    "Description"
                )} is required to build Slash Command.`
            );

        if (Name && Description) {
            command.name = Name.toLowerCase();
            command.description = Description;

            if (Options && Array.isArray(Options)) {
                let optionTypes = [
                        "string",
                        3,
                        "integer",
                        4,
                        "boolean",
                        5,
                        "user",
                        6,
                        "channel",
                        7,
                        "role",
                        8,
                        "mentionable",
                        9,
                    ],
                    channelTypes = [
                        "guild_text",
                        0,
                        "text",
                        "guild_voice",
                        2,
                        "voice",
                        "guild_category",
                        4,
                        "category",
                        "guild_news",
                        5,
                        "news",
                        "guild_store",
                        6,
                        "store",
                        "store_thread",
                        "guild_news_thread",
                        10,
                        "news thread",
                        "news_thread",
                        "guild_public_thread",
                        11,
                        "public thread",
                        "public_thread",
                        "guild_private_thread",
                        12,
                        "private thread",
                        "private_thread",
                        "guild_stage_voice",
                        13,
                        "stage channel",
                        "stage voice",
                        "stage_channel",
                        "stage_voice",
                    ];
                for (let index = 0; index < Options.length; index++) {
                    const option = Options[index];
                    if (
                        option.Type &&
                        optionTypes.includes(option.Type.toLowerCase())
                    ) {
                        if (!option.Name)
                            Utils.logError(
                                `[Utils] [SlashCommandCreator] A ${chalk.bold(
                                    "Name"
                                )} is required to build Slash Command's option.`
                            );
                        if (!option.Description)
                            Utils.logError(
                                `[Utils] [SlashCommandCreator] A ${chalk.bold(
                                    "Description"
                                )} is required to build Slash Command's option.`
                            );

                        if (option.Name && option.Description) {
                            let optionData = {
                                name: option.Name.toLowerCase(),
                                description: option.Description,
                                required: option.Required ? true : false,
                                channel_types:
                                    option.ChannelTypes &&
                                    Array.isArray(option.ChannelTypes)
                                        ? []
                                        : null,
                                choices: [],
                            };

                            if (option.Type) {
                                if (
                                    ["string", 3].includes(
                                        option.Type.toLowerCase()
                                    )
                                ) {
                                    optionData.type = 3;
                                } else if (
                                    ["integer", 4].includes(
                                        option.Type.toLowerCase()
                                    )
                                ) {
                                    optionData.type = 4;
                                } else if (
                                    ["boolean", 5].includes(
                                        option.Type.toLowerCase()
                                    )
                                ) {
                                    optionData.type = 5;
                                } else if (
                                    ["user", 6].includes(
                                        option.Type.toLowerCase()
                                    )
                                ) {
                                    optionData.type = 6;
                                } else if (
                                    ["channel", 7].includes(
                                        option.Type.toLowerCase()
                                    )
                                ) {
                                    optionData.type = 7;
                                } else if (
                                    ["role", 8].includes(
                                        option.Type.toLowerCase()
                                    )
                                ) {
                                    optionData.type = 8;
                                } else if (
                                    ["mentionable", 9].includes(
                                        option.Type.toLowerCase()
                                    )
                                ) {
                                    optionData.type = 9;
                                } else {
                                    Utils.logError(
                                        `[Utils] [SlashCommandCreator] Invalid ${chalk.bold(
                                            "Option.Type"
                                        )} property.`
                                    );
                                }
                            }
                            if (
                                option.Choices &&
                                Array.isArray(option.Choices) &&
                                [
                                    "string",
                                    3,
                                    "integer",
                                    4,
                                    "number",
                                    10,
                                ].includes(option.Type.toLowerCase())
                            ) {
                                option.Choices.forEach((choice) => {
                                    if (!choice.Name)
                                        Utils.logError(
                                            `[Utils] [SlashCommandCreator] A ${chalk.bold(
                                                "Name"
                                            )} is required to build Slash Command's option's choice.`
                                        );
                                    if (!choice.Value)
                                        Utils.logError(
                                            `[Utils] [SlashCommandCreator] A ${chalk.bold(
                                                "Value"
                                            )} is required to build Slash Command's option's choice.`
                                        );
                                    if (choice.Name && choice.Value) {
                                        optionData.choices.push({
                                            name: choice.Name,
                                            value: choice.Value.toLowerCase(),
                                        });
                                    }
                                });
                            }
                            if (
                                option.ChannelTypes &&
                                Array.isArray(option.ChannelTypes) &&
                                ["channel", 7].includes(
                                    option.Type.toLowerCase()
                                )
                            ) {
                                option.ChannelTypes.forEach((channelType) => {
                                    if (
                                        channelTypes.includes(
                                            channelType.toLowerCase()
                                        )
                                    ) {
                                        if (
                                            ["guild_text", 0, "text"].includes(
                                                channelType.toLowerCase()
                                            )
                                        ) {
                                            optionData.channel_types.push(0);
                                        } else if (
                                            [
                                                "guild_voice",
                                                2,
                                                "voice",
                                            ].includes(
                                                channelType.toLowerCase()
                                            )
                                        ) {
                                            optionData.channel_types.push(2);
                                        } else if (
                                            [
                                                "guild_category",
                                                4,
                                                "category",
                                            ].includes(
                                                channelType.toLowerCase()
                                            )
                                        ) {
                                            optionData.channel_types.push(4);
                                        } else if (
                                            ["guild_news", 5, "news"].includes(
                                                channelType.toLowerCase()
                                            )
                                        ) {
                                            optionData.channel_types.push(5);
                                        } else if (
                                            [
                                                "guild_store",
                                                6,
                                                "store",
                                                "store_thread",
                                            ].includes(
                                                channelType.toLowerCase()
                                            )
                                        ) {
                                            optionData.channel_types.push(6);
                                        } else if (
                                            [
                                                "guild_news_thread",
                                                10,
                                                "news thread",
                                                "news_thread",
                                            ].includes(
                                                channelType.toLowerCase()
                                            )
                                        ) {
                                            optionData.channel_types.push(10);
                                        } else if (
                                            [
                                                "guild_public_thread",
                                                11,
                                                "public thread",
                                                "public_thread",
                                            ].includes(
                                                channelType.toLowerCase()
                                            )
                                        ) {
                                            optionData.channel_types.push(11);
                                        } else if (
                                            [
                                                "guild_private_thread",
                                                12,
                                                "private thread",
                                                "private_thread",
                                            ].includes(
                                                channelType.toLowerCase()
                                            )
                                        ) {
                                            optionData.channel_types.push(12);
                                        } else if (
                                            [
                                                "guild_stage_voice",
                                                13,
                                                "stage channel",
                                                "stage voice",
                                                "stage_channel",
                                                "stage_voice",
                                            ].includes(
                                                channelType.toLowerCase()
                                            )
                                        ) {
                                            optionData.channel_types.push(13);
                                        }
                                    } else {
                                        Utils.logError(
                                            `[Utils] [SlashCommandCreator] Invalid ${chalk.bold(
                                                "ChannelType"
                                            )} property.`
                                        );
                                    }
                                });
                            }

                            command.options.push(optionData);
                        }
                    } else if (!option.Type) {
                        Utils.logError(
                            `[Utils] [SlashCommandCreator] A ${chalk.bold(
                                "Type"
                            )} is required to build Slash Command's Option`
                        );
                    } else {
                        Utils.logError(
                            `[Utils] [SlashCommandCreator] Invalid ${chalk.bold(
                                "Type"
                            )} property.`
                        );
                    }
                }
            }
        } else {
            return false;
        }
        return command;
    }
};
