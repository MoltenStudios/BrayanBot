import { Addon } from "../Modules/Structures/Handlers/Addons";
import Utils from "../Modules/Utils";
import chalk from "chalk";
import { Command } from "../Modules/Structures/Handlers/Commands";

const addon = new Addon("test", "v1.1.1"), addonConfig = { config: {}, lang: {} };

/** @ts-ignore */
const { config, lang } = addon.customConfig(addonConfig);

addon.setLog(chalk.hex("#f52486").bold("[") + chalk.hex("#e01e37").bold("BrayanBot") + chalk.hex("#f52486").bold("]"), 
    chalk.bold("TesT"), "has been loaded!", `Version: ${chalk.bold(`v1.1.1`)}`);

addon.setExecute(async (manager) => {
    console.log("TesT addon executed!");

    new Command({
        commandData: {
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
        },
        commandConfig: {
            guildOnly: true,
            dmOnly: false,
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