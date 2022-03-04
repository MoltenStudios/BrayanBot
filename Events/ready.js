const { REST } = require("@discordjs/rest"), { Routes } = require("discord-api-types/v9"),
    Discord = require("discord.js"), Utils = require("../Modules/Utils"),
    packageJSON = require("../package.json"), fsUtils = require("nodejs-fs-utils"),
    chalk = require("chalk");

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
    await Utils.logInfo(`                     ${chalk.blue(chalk.underline(`https://brayanbot.dev/discprd`))}                        `);
    await Utils.logInfo("                                                                          ");
    await Utils.logInfo("#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#");
    await Utils.logInfo(`${chalk.bold(bot.Commands.size)} Command${bot.Commands.size == 1 ? "" : "s"} Loaded.`);
    await Utils.logInfo(`${chalk.bold(bot.Events.length)} Event${bot.Events.length == 1 ? "" : "s"} Loaded.`);

    await rest.put(Routes.applicationGuildCommands(bot.user.id, guild.id), {
        body: SlashCmdsData.filter((x) => typeof x == "object"),
    }).then(async registredCommands => {
        let fullPermissions = [];
        for (let index = 0; index < registredCommands.length; index++) {
            let element = registredCommands[index],
                commandYMLData = SlashCmds.find(x => x.name.toLowerCase() == element.name.toLowerCase()),
                cmdPerms = [];
            if (!commandYMLData.commandData.Permission.includes("@everyone")) {
                for (let i = 0; i < commandYMLData.commandData.Permission.length; i++) {
                    const element2 = commandYMLData.commandData.Permission[i];
                    if (element2.toLowerCase() !== "@everyone") {
                        let role = await Utils.findRole(element2, guild, true)
                        if (role) {
                            cmdPerms.push({
                                id: role.id,
                                type: "ROLE",
                                permission: true
                            })
                        }
                    }
                }
                fullPermissions.push({
                    id: element.id,
                    permissions: cmdPerms
                })
            } else {
                fullPermissions.push({
                    id: element.id,
                    permissions: [
                        {
                            id: guild.id,
                            type: "ROLE",
                            permission: true
                        }
                    ]
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


    await Utils.logInfo(`Logged in as: ${chalk.bold(bot.user.tag)}`);
    await Utils.logInfo(`Currently using ${chalk.bold(Utils.bytesToSize(fSize))} of storage`);
    bot.guilds.cache.size > 1
        ? Utils.logWarning(`Currently in ${chalk.bold(bot.guilds.cache.size)} servers. | ${chalk.hex("##ff596d")(`Brayan Bot is not made for multiple servers.`)}`)
        : Utils.logInfo(`Currently in ${chalk.bold(bot.guilds.cache.size)} server.`);
    await Utils.logInfo(`Bot Ready!`);
};
module.exports.once = true;
