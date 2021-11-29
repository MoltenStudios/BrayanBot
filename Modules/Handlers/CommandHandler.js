const { client, config, lang, commands } = require("../../index"),
    { SlashCommandBuilder } = require('@discordjs/builders'),
    Utils = require("../Utils"),
    fs = require('fs')

let commandStructure = {
    name: String,
    type: String,
    commandData: {
        Description: String,
        Usage: String,
        Aliases: Array,
        Permission: Array,
        SlashCommand: { 
            Enabled: Boolean 
        }
    },
    slashData: SlashCommandBuilder,
    run: Function,
    runSlash: Function
}

module.exports = {
    /**
     * 
     * @param {Object} commandStructure 
     */
    set: (command) => {
        try {
            client.Commands.set(command.name, command)
            command.commandData.Aliases.forEach(alias => {
                client.Aliases.set(alias, command.name)
            })
            if(command.commandData.SlashCommand && command.commandData.SlashCommand.Enabled) {
                client.SlashCmdsData.push(command.slashData)
                client.SlashCmds.push(command)
            }
        } catch(e) {
            Utils.logError(e)
        }
    },
    init: () => {
        fs.readdirSync('./Commands').forEach(async (dir) => {
            fs.readdir(`./Commands/${dir}`, (e, files) => {
                if(e) return Utils.logError(e);
                let jsFiles = files.filter(f => f.split(".").pop() == 'js');
                if(jsFiles.length <= 0) return;
                jsFiles.forEach(file => {
                    try {
                        module.exports.set(require(`../../Commands/${dir}/${file}`))
                    } catch(e) {
                        Utils.logError(e)
                    }
                })
            })
        })
    }
}