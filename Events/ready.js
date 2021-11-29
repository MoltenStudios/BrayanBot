const { REST } = require('@discordjs/rest'),
    { Routes } = require('discord-api-types/v9'),
    Discord = require('discord.js'),
    Utils = require('../Modules/Utils'),
    packageJSON = require('../package.json')
/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Interaction} interaction 
 */
module.exports = async (bot) => {
    const { SlashCmds, SlashCmdsData, config } = bot;
    await Utils.logInfo('#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#');
    await Utils.logInfo('                                                                          ');
    await Utils.logInfo(`                   • Zeltux ${packageJSON.version} is now Online! •       `);
    await Utils.logInfo('                                                                          ');
    await Utils.logInfo('          • Join our Discord Server for any Issues/Custom Bots •          ');
    await Utils.logInfo('                     https://discord.gg/EgeZxGg6ev                        ');
    await Utils.logInfo('                                                                          ');
    await Utils.logInfo('#-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=#');

    await Utils.logInfo(`${bot.Commands.size} Command(s) Loaded.`)
    await Utils.logInfo(`${bot.Events.length} Event(s) Loaded.`)
    await require('../Modules/Handlers/AddonHandler').init()
    const rest = new REST({ version: '9' }).setToken(config.Settings.Token);
    try {
        await rest.put(Routes.applicationGuildCommands(bot.user.id, config.Settings.ServerID), {
            body: SlashCmdsData
        });
    } catch (error) {
        Utils.logError(error);
    }
    Utils.logInfo("Bot ready.")
}
module.exports.once = true