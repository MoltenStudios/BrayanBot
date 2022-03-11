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
    }).then(async registredCommands => {
        let fullPermissions = [];
        for (let index = 0; index < registredCommands.length; index++) {
            let element = registredCommands[index],
                commandYMLData = SlashCmds.find(x => x.name.toLowerCase() == element.name.toLowerCase()),
                cmdPerms = [];
            if (!commandYMLData.commandData.Permission.includes("@everyone")) {
                if (typeof commandYMLData.commandData.Permission == "string") {
                    commandYMLData.commandData.Permission = [commandYMLData.commandData.Permission]
                }
                for (let i = 0; i < commandYMLData.commandData.Permission.length; i++) {
                    const perm = commandYMLData.commandData.Permission[i]
                    const prole = !!Utils.findRole(perm, guild, false),
                        puser = !!Utils.parseUser(perm, guild, false);
                    if (!prole && !puser) return Utils.logError(`${chalk.bold(perm)} role nor user was not found in ${chalk.bold(guild.name)} guild`);
                    if (prole) {
                        const role = await Utils.findRole(perm, guild, true)
                        cmdPerms.push({
                            id: role.id,
                            type: "ROLE",
                            permission: true
                        })
                    }
                    if (puser) {
                        const user = Utils.parseUser(perm, guild, true)
                        cmdPerms.push({
                            id: user.id,
                            type: "USER",
                            permission: true
                        })
                    }
                }
                fullPermissions.push({
                    id: element.id,
                    permissions: cmdPerms
                })
            } else {
                fullPermissions.push({
                    id: element.id,
                    permissions: [{
                        id: guild.id,
                        type: "ROLE",
                        permission: true
                    }]
                })
            }
        }
        await guild.commands.permissions.set({ fullPermissions })
        await Utils.logInfo(`${chalk.bold(SlashCmdsData.length)} Slash Command${SlashCmdsData.length == 1 ? "" : "s"} Loaded.`);
    }).catch(e => {
        if (e.code == 50001) {
            Utils.logWarning(`[SlashCommands] \"${chalk.bold(`application.commands`)}\" scope wasn't selected while inviting the bot. Please use the below link to re-invite your bot.`)
            Utils.logWarning(`[SlashCommands] ${chalk.blue(chalk.underline(chalk.bold(`https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot%20applications.commands`)))}`)
        } else {
            Utils.logError(e);
        }
    })

    app.listen(config.WebServer.Port || 80, () => {
        Utils.logInfo(`WebServer is now Online & Listening on port ${chalk.bold(config.WebServer.Port || 80)}`)
    })

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
        ? Utils.logWarning(`Currently in ${chalk.bold(bot.guilds.cache.size)} servers. | ${chalk.hex("##ff596d")(`Brayan Bot is not made for multiple servers.`)}`)
        : Utils.logInfo(`Currently in ${chalk.bold(bot.guilds.cache.size)} server.`);
    await Utils.logInfo(`Bot Ready!`);
};
module.exports.once = true;
