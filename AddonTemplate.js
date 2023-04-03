import { Command } from "../../src/Modules/Structures/Handlers/Commands.js";
import { Addon } from "../../src/Modules/Structures/Handlers/Addons.js";
import Utils from "../../src/Modules/Utils.js";
import chalk from "chalk";

const addon = new Addon("test", "v1.1.1"), addonConfig = {
    config: {
        test: true
    },
    lang: {
        test: true
    },
    commands: {
        Test: {
            Enabled: true,
            Name: "test",
            Usage: 'test',
            Cooldown: 0,
            Permission: ["@everyone"],
            Description: "This is a test command",
            DeleteCommand: false,
            SlashCommand: {
                Enabled: true,
                Data: {
                    Name: "test",
                    Description: "This is a test command",
                    Options: [],
                }
            }
        }
    }
};

/** @type {addonConfig} */
const { config, lang, commands } = addon.customConfig(addonConfig);

addon.setLog(chalk.hex("#f52486").bold("[") + chalk.hex("#e01e37").bold("Proxima") + chalk.hex("#f52486").bold("]"),
    chalk.bold("TesT"), "has been loaded!", `Version: ${chalk.bold(`v1.1.1`)}`);

addon.setExecute(async (manager) => {
    console.log("TesT addon executed!");

    new Command({
        commandData: commands.Test,
        commandConfig: {
            guildOnly: true,
            dmOnly: false,
            // these are the discord permissions that the bot and user need to run the command
            // not roles
            requiredPermissions: {
                bot: [],
                user: []
            }
        },
        LegacyRun(manager, message, args, prefixUsed, commandData) {
            message.channel.send("This is a test command!");
        },
        InteractionRun(manager, interaction, commandData) {
            interaction.reply("This is a test command!");
        },
    })
})

export default addon;