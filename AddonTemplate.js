const { getConfig } = require('../Modules/Handlers/AddonHandler'),
    CommandHandler = require('../Modules/Handlers/CommandHandler'),
    EventHandler = require('../Modules/Handlers/EventHandler'),
    { SlashCommandBuilder } = require('@discordjs/builders'),
    Utils = require('../Modules/Utils')

module.exports = {
    _name: "Test",
    _log: true,
    _author: {
        name: "Zorino",
        color: "#FFE400"
    },
    _priority: 1,
    _customConfigData: {
        Test: "test",
    },
    run: async (bot, config) => {
        const customConfig = getConfig("Test")
        CommandHandler.set({
            name: 'test',
            type: 'test',
            commandData: {
                Description: 'test',
                Usage: 'test',
                Aliases: [],
                Permission: [
                    'Developer'
                ],
                SlashCommand: {
                    Enabled: false
                }
            },
            slashData: new SlashCommandBuilder(),
            run: (bot, message, args, config) => { },
            runSlash: (bot, interaction) => { }
        })
    }
}