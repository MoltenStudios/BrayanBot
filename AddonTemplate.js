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
    }
}
module.exports.run = async (bot, customConfig) => {
    CommandHandler.set({
        name: 'test',
        type: 'Utility',
        commandData: {
            Description: 'Test Command to test stuff.',
            Usage: 'test',
            Aliases: [],
            Permission: [
                'Developer'
            ],
            SlashCommand: {
                Enabled: true
            }
        },
        slashData: new SlashCommandBuilder()
            .setName('test')
            .setDescription("Test Command to test stuff."),
        run: (bot, message, args, config) => { },
        runSlash: (bot, interaction) => { }
    })
}