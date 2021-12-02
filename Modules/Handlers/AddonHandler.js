const fs = require('fs'),
    YAML = require("yaml"),
    chalk = require('chalk'),
    Utils = require("../Utils"),
    { SlashCommandBuilder } = require('@discordjs/builders'),
    { client, config, lang, commands } = require("../../index");

module.exports = {
    getConfig: (name) => {
        if (fs.existsSync('./Addon_Configs') && fs.existsSync(`./Addon_Configs/${name}.yml`)) {
            return YAML.parse(fs.readFileSync(`./Addon_Configs/${name}.yml`, 'utf-8'));
        } else {
            return false;
        }
    },
    init: async () => {
        if (fs.existsSync('./Addons')) {
            fs.readdir('Addons', async (err, files) => {
                files = files.filter(f => f.split(".").pop() == 'js')
                if (files) {

                    // Priority Sorting
                    let priority = { "0": [], "1": [], "2": [], "3": [], }, index
                    for (index = 0; index < files.length; index++) {
                        let f = require(`../../Addons/${files[index]}`)
                        if (f._priority) {
                            if (f._priority == 1) priority[0].push(files[index])
                            else if (f._priority == 2) priority[1].push(files[index])
                            else if (f._priority == 3) priority[2].push(files[index])
                            else priority[3].push(files[index])
                        } else priority[3].push(files[index])
                    }

                    // Priority Executing 
                    for (index = 0; index <= 5; index++) {
                        let addonFiles = priority[index]
                        if (addonFiles) {
                            for (let y = 0; y < addonFiles.length; y++) {
                                try {
                                    const addon = require(`../../Addons/${addonFiles[y]}`);
                                    if (addon && typeof addon.run == 'function') {
                                        // Custom Config
                                        if (addon._customConfigData) {
                                            let fsPath = `./Addon_Configs/${addon._name ? addon._name : file.replace('.js', '')}.yml`
                                            if (!fs.existsSync('./Addon_Configs')) await fs.mkdirSync('./Addon_Configs')
                                            if (fs.existsSync(fsPath)) {
                                                // DevMode
                                                if (config.Settings.DevMode) fs.writeFileSync(fsPath, YAML.stringify(addon._customConfigData))
                                            } else fs.writeFileSync(fsPath, YAML.stringify(addon._customConfigData))
                                        }

                                        // Executing Addon
                                        await addon.run(client, addon._customConfigData)

                                        // Addon Logging
                                        if (typeof addon._log == 'string' && !addon._author) {
                                            Utils.logInfo(addon._log)
                                        } else if (addon._log && typeof addon._author == 'string') {
                                            console.log(`${chalk.hex(addon._author.color || "#57ff6b").bold(`[${addon._author ? addon._author : '[INFO]'}]`)} ${addon._name ? addon._name : file.replace('.js', '')} addon loaded`)
                                        } else if (addon._log && typeof addon._author == 'object') {
                                            console.log(`${chalk.hex(addon._author.color || "#57ff6b").bold(`[${addon._author.name}]`)} ${addon._name ? addon._name : file.replace('.js', '')} addon loaded`)
                                        }
                                    } else {
                                        Utils.logWarning(`Unable to execute ${addon._name ? addon._name : file.replace('.js', '')} addon ${addon._author ? `by ${addon._author}` : ''}`)
                                    }
                                } catch (e) {
                                    Utils.logError(e)
                                }
                            }
                        }
                    }
                }
            })
        } else {
            fs.mkdirSync('./Addons')
            await module.exports.init()
        }
    },
    addonStructure: {
        _name: String,
        _log: String || Function,
        _author: String,
        _customConfigData: Object,
        _commands: [
            {
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
        ],
        _events: [
            {
                name: String,
                run: Function
            }
        ],
        run: Function
    }
}