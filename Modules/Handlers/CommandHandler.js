const { client, config, lang, commands } = require("../../index"),
    { SlashCommandBuilder } = require("@discordjs/builders"),
    Utils = require("../Utils"),
    fs = require("fs");

let commandStructure = {
    name: String,
    type: String,
    commandData: {
        Description: String,
        Usage: String,
        Aliases: Array,
        Permission: Array,
        SlashCommand: {
            Enabled: Boolean,
            Data: Object,
        },
    },
    run: Function,
    runSlash: Function,
};
module.exports = {
    /**
     *
     * @param {commandStructure} command
     */
    set: (command) => {
        try {
            let enableWhenDisabled = commands.DisabledCommands;
            if (!enableWhenDisabled.includes(command.name.toLowerCase())) {
                client.Commands.set(command.name, command);
                command.commandData.Aliases.forEach((alias) => {
                    client.Aliases.set(alias, command.name);
                });
                if (
                    command.commandData.SlashCommand &&
                    command.commandData.SlashCommand.Enabled
                ) {
                    let slashD = Utils.parseSlashCommands(
                        command.commandData.SlashCommand.Data
                    );
                    if (slashD && slashD.name && slashD.description) {
                        client.SlashCmdsData.push(slashD);
                        client.SlashCmds.push(command);
                    }
                }
            }
        } catch (e) {
            console.log(e);
            Utils.logError(e);
        }
    },
    init: () => {
        fs.readdirSync("./Commands").forEach(async (dir) => {
            fs.readdir(`./Commands/${dir}`, (e, files) => {
                if (e) return Utils.logError(e);
                let jsFiles = files.filter((f) => f.split(".").pop() == "js");
                if (jsFiles.length <= 0) return;
                jsFiles.forEach((file) => {
                    try {
                        module.exports.set(
                            require(`../../Commands/${dir}/${file}`)
                        );
                    } catch (e) {
                        Utils.logError(e);
                    }
                });
            });
        });

        return true;
    },
};
