const { REST } = require("@discordjs/rest"),
    { Routes } = require("discord-api-types/v9"),
    Discord = require("discord.js"),
    Utils = require("../Modules/Utils"),
    packageJSON = require("../package.json"),
    fsUtils = require("nodejs-fs-utils"),
    chalk = require("chalk");
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Interaction} interaction
 */
module.exports = async (bot) => {
    let { SlashCmds, SlashCmdsData, config } = bot;

    await Utils.logInfo(
        "#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#"
    );
    await Utils.logInfo(
        "                                                                          "
    );
    await Utils.logInfo(
        `                    • ${chalk.bold(
            `Brayan Bot v${packageJSON.version}`
        )} is now Online! •       `
    );
    await Utils.logInfo(
        "                                                                          "
    );
    await Utils.logInfo(
        "          • Join our Discord Server for any Issues/Custom Bots •          "
    );
    await Utils.logInfo(
        `                     ${chalk.blue(
            chalk.underline(`https://discord.gg/EgeZxGg6ev`)
        )}                        `
    );
    await Utils.logInfo(
        "                                                                          "
    );
    await Utils.logInfo(
        "#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#"
    );

    let fSize = fsUtils.fsizeSync('./', {
        skipErrors: true,
        countFolders: true
    })

    await Utils.logInfo(`${chalk.bold(bot.Commands.size)} Command${bot.Commands.size == 1 ? "" : "s"} Loaded.`);
    await Utils.logInfo(`${chalk.bold(bot.Events.length)} Event${bot.Events.length == 1 ? "" : "s"} Loaded.`);
    const rest = new REST({ version: "9" }).setToken(config.Settings.Token);
    SlashCmdsData = SlashCmdsData.filter((x) => typeof x == "object");
    try {
        await rest.put(
            Routes.applicationGuildCommands(
                bot.user.id,
                config.Settings.ServerID
            ),
            {
                body: SlashCmdsData,
            }
        );
        await Utils.logInfo(
            `${chalk.bold(SlashCmdsData.length)} Slash Command${SlashCmdsData.length == 1 ? "" : "s"} Loaded.`
        );
    } catch (error) {
        console.log(error);
        Utils.logError(error);
    }

    await Utils.logInfo(`Logged in as: ${chalk.bold(bot.user.tag)}`);
    await Utils.logInfo(`Currently using ${chalk.bold(Utils.bytesToSize(fSize))} of storage`);
    bot.guilds.cache.size > 1
        ? Utils.logWarning(`Currently in ${chalk.bold(bot.guilds.cache.size)} servers. | ${chalk.hex("##ff596d")(`Brayan Bot is not made for multiple servers.`)}`)
        : Utils.logInfo(`Currently in ${chalk.bold(bot.guilds.cache.size)} server.`);
    await Utils.logInfo(`Bot Ready!`);
};
module.exports.once = true;
