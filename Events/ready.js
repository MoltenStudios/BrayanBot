const { REST } = require("@discordjs/rest"), { Routes } = require("discord-api-types/v9"),
    { app } = require('../Modules/Handlers/ExpressHandler'),
    Discord = require("discord.js"), Utils = require("../Modules/Utils"),
    packageJSON = require("../package.json"), fsUtils = require("nodejs-fs-utils"),
    chalk = require("chalk"), axios = require('axios').default;
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Interaction} interaction
 */
module.exports = async (bot) => {
    let { SlashCmds, SlashCmdsData, config } = bot,
        rest = new REST({ version: "9" }).setToken(config.Settings.Token),
        fSize = fsUtils.fsizeSync('./', {
            skipErrors: true,
            countFolders: true
        }), guild = bot.guilds.cache.first();

    if (!guild) {
        Utils.logError(`Currently in ${chalk.bold(0)} servers. | Bot is required to be in atleast ${chalk.bold(1)} server. Use the link below to invite the bot into your server.`)
        Utils.logError(chalk.blue(`https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot%20applications.commands`))
        process.exit(0)
    }
    await Utils.logInfo("#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#");
    await Utils.logInfo("                                                                          ");
    await Utils.logInfo(`                    • ${chalk.bold(`Brayan Bot v${packageJSON.version}`)} is now Online! •       `);
    await Utils.logInfo("                                                                          ");
    await Utils.logInfo("          • Join our Discord Server for any Issues/Custom Bots •          ");
    await Utils.logInfo(`                     ${chalk.blue(chalk.underline(`https://brayanbot.dev/discord`))}                        `);
    await Utils.logInfo("                                                                          ");
    await Utils.logInfo("#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#");
    await Utils.logInfo(`${chalk.bold(bot.Events.length)} Event${bot.Events.length == 1 ? "" : "s"} Loaded.`);
    await Utils.logInfo(`${chalk.bold(bot.Commands.size)} Command${bot.Commands.size == 1 ? "" : "s"} Loaded.`);

    await rest.put(Routes.applicationGuildCommands(bot.user.id, guild.id), {
        body: SlashCmdsData.filter((x) => typeof x == "object"),
      
    }).catch(e => {
        if (e.code == 50001) {
            Utils.logWarning(`[SlashCommands] \"${chalk.bold(`application.commands`)}\" scope wasn't selected while inviting the bot. Please use the below link to re-invite your bot.`)
            Utils.logWarning(`[SlashCommands] ${chalk.blue(chalk.underline(chalk.bold(`https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot%20applications.commands`)))}`)
        } else {
            Utils.logError(e.stack);
        }
    })

    if (config.WebServer && config.WebServer.Enabled) {
        app.listen(config.WebServer.Port || 80, () => {
            Utils.logInfo(`WebServer is now Online & Listening on port ${chalk.bold(config.WebServer.Port || 80)}`)
        })
    }

    await axios({
        baseURL: "https://api.github.com",
        url: "repos/BrayanbotDev/BrayanBot/releases/latest",
        method: "GET"
    }).then(async ({ data }) => {
        if (data) {
            let { tag_name: tagName, target_commitish: repo } = data;
            if (!data.draft && repo == "main") {
                let newVersion = tagName.trim().replace(/^[=v]+/, '').split("."),
                    curVersion = packageJSON.version.split("."),
                    versions = [true, true, true]
                for (let i = 0; i < newVersion.length; i++)
                    if (newVersion[i] > curVersion[i]) versions[i] = false

                if (versions[0] == false) {
                    Utils.logWarning(`You are running on older version of ${chalk.bold("BrayanBot")}, please update your bot to apply any ${chalk.bold("Major")} changes.`)
                } else if (versions[1] == false) {
                    Utils.logWarning(`You are running on older version of ${chalk.bold("BrayanBot")}, please update your bot to apply any ${chalk.bold("Minor")} changes.`)
                } else if (versions[2] == false) {
                    Utils.logWarning(`You are running on older version of ${chalk.bold("BrayanBot")}, please update your bot to apply any ${chalk.bold("Patch")} changes.`)
                } else if (versions[0] == true && versions[1] == true && versions[2] == true) {
                    Utils.logInfo(`You are running latest version of ${chalk.bold("BrayanBot")}!`)
                }
            }
        }
    }).catch(async (e) => {
        if (e.response && e.response.status == 404) {
            Utils.logWarning(`Unable to fetch latest BrayanBot releases.`)
        } else if (e.response && e.response.data && e.response.data.message.includes("rate limit")) {
            Utils.logWarning("Skipping Github Version check due to rate limits.")
        } else {
            Utils.logError(`[Update-Checker] ${e}`)
        }
    })

    await Utils.logInfo(`Logged in as: ${chalk.bold(bot.user.tag)}`);
    await Utils.logInfo(`Currently using ${chalk.bold(Utils.bytesToSize(fSize))} of storage`);
    bot.guilds.cache.size > 1
        ? Utils.logWarning(`Currently in ${chalk.bold(bot.guilds.cache.size)} servers. | ${chalk.hex("##ff596d")(`BrayanBot is not made for multiple servers.`)}`)
        : Utils.logInfo(`Currently in ${chalk.bold(bot.guilds.cache.size)} server.`);
    await Utils.logInfo(`Bot Ready!`);
};
module.exports.once = true;
