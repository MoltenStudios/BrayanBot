const { REST } = require('@discordjs/rest'),
    { Routes } = require('discord-api-types/v9'),
    Discord = require('discord.js'),
    Utils = require('../Modules/Utils'),
    packageJSON = require('../package.json'),
    chalk = require('chalk')
/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Interaction} interaction 
 */
module.exports = async (bot) => {
    const { SlashCmds, SlashCmdsData, config } = bot;

    await Utils.logInfo('#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#');
    await Utils.logInfo('                                                                          ');
    await Utils.logInfo(`                    • Brayan Bot ${packageJSON.version} is now Online! •       `);
    await Utils.logInfo('                                                                          ');
    await Utils.logInfo('          • Join our Discord Server for any Issues/Custom Bots •          ');
    await Utils.logInfo('                     https://discord.gg/EgeZxGg6ev                        ');
    await Utils.logInfo('                                                                          ');
    await Utils.logInfo('#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#');

    await Utils.logInfo(`${bot.Commands.size} Command(s) Loaded.`)
    await Utils.logInfo(`${bot.Events.length} Event(s) Loaded.`)
    const rest = new REST({ version: '9' }).setToken(config.Settings.Token);
    try {
        await rest.put(Routes.applicationGuildCommands(bot.user.id, config.Settings.ServerID), {
            body: SlashCmdsData
        });
        await Utils.logInfo(`${SlashCmdsData.length} Slash Command(s) Loaded.`)
    } catch (error) {
        Utils.logError(error);
    }

    await Utils.logInfo(`Logged in as: ${bot.user.tag}`)
    bot.guilds.cache.size > 1 ? Utils.logWarning(`Currently in ${chalk.bold(bot.guilds.cache.size)} server(s). | ${chalk.hex("##ff596d")(`Brayan Bot is not made for multiple servers.`)}`) : Utils.logInfo(`Currently in ${chalk.bold(bot.guilds.cache.size)} server(s).`)
    await Utils.logInfo(`Bot Ready!`);

}
module.exports.once = true