const { client, config, lang, commands } = require("../../index"),
    Utils = require("../Utils"), fs = require("fs"),
    path = require('path'), Discord = require("discord.js");


let slashCommandOptionsStructure = [
    {
        Type: String | Number,
        Name: String,
        Description: String,
        Required: Boolean,
        ChannelTypes: Array,
        DeleteCommand: true,
        Choices: [
            {
                Name: String,
                Value: String | Number | Int8Array | Int16Array | Int32Array,
            },
        ],
    },
], slashCommandDataStructure = {
    Name: String,
    Description: String,
    Options: slashCommandOptionsStructure,
}, commandDataStructure = {
    Description: String,
    Usage: String,
    Aliases: Array,
    Permission: Array,
    SlashCommand: {
        Enabled: Boolean,
        Data: slashCommandDataStructure,
    },
}, commandStructure = {
    name: String,
    type: String,
    commandData: commandDataStructure,
    run: Function,
    runSlash: Function,
};

const isFunction = (data) => typeof data == "function";
module.exports = {
    Command: class Command {
        /**
         * @param {commandStructure} options 
         */
        constructor(options = {}) {
            if (options && typeof options === "object" && Object.keys(options).length > 0) {
                this.setName(typeof options.name == "string" ? options.commandData ? options.commandData.Name ? options.commandData.Name : options.name : options.name : null)
                this.setType(typeof options.type == "string" ? options.type : "other")
                this.setCommandData(typeof options.commandData == "object" ? options.commandData : {})
            }

            return this;
        }

        /**
         * @param {String} name 
         */
        setName(name) { this.name = name; return this; }

        /**
         * @param {String} type 
         */
        setType(type) { this.type = type; return this; }

        /**
         * @param {commandDataStructure} commandData 
         */
        setCommandData(commandData) {
            if (commandData.Name && typeof commandData.Name == "string") this.setName(commandData.Name);
            if (commandData.Type && typeof commandData.Type == "string") this.setType(commandData.Type);
            this.commandData = commandData;
            return this;
        }

        /**
         * @callback runLegacyCommands
         * @param {Discord.Client} bot
         * @param {Discord.Message} message
         * @param {Array} args
         */

        /**
         * 
         * @param {runLegacyCommands} run 
         */
        setRun(run) { this.run = run; return this; }

        /**
         * @callback runSlashCommands
         * @param {Discord.Client} bot
         * @param {Discord.BaseCommandInteraction} interaction
         * @param {Object} options
         */

        /**
         * @param {runSlashCommands} runSlash 
         */
        setRunSlash(runSlash) { this.runSlash = runSlash; return this; }

        isCommandRegistred() { return client.Commands.has(this.name); }

        /*reloadCommand() {
            if (this.isCommandRegistred()) {
                client.Commands.delete(this.name);
                this.commandData.Aliases.forEach((alias) => client.Aliases.delete(alias));
                client.SlashCmdsData = client.SlashCmdsData.filter((cmd) => cmd.name !== this.name);
                client.SlashCmds = client.SlashCmds.filter((cmd) => cmd.name !== this.name);
                this.registerCommand();
            }
            return this;
        }*/

        registerCommand() {
            if (!this.isCommandRegistred() && this.name && this.commandData) {
                if (!this.type || typeof this.type !== "string") this.type = "other";

                if (this.commandData.Description && this.commandData.Usage) {
                    if (!this.commandData.Aliases || !Array.isArray(this.commandData.Aliases))
                        this.commandData.Aliases = [];
                    if (!this.commandData.Permission || !Array.isArray(this.commandData.Permission))
                        this.commandData.Permission = ["@everyone"];
                    if (!this.commandData.SlashCommand || typeof this.commandData.SlashCommand !== "object")
                        this.commandData.SlashCommand = { Enabled: false };
                    if (!this.commandData.SlashCommand.Data || typeof this.commandData.SlashCommand.Data !== "object")
                        this.commandData.SlashCommand.Data = { Name: this.name, Description: this.commandData.Description };
                    if (!this.commandData.SlashCommand.Data.Options || !Array.isArray(this.commandData.SlashCommand.Data.Options))
                        this.commandData.SlashCommand.Data.Options = [];

                    if (!commands.DisabledCommands.includes(this.name)) {
                        client.Commands.set(this.name, this);
                        this.commandData.Aliases.forEach((alias) => client.Aliases.set(alias, this.name));

                        if (this.commandData.SlashCommand && this.commandData.SlashCommand.Enabled) {
                            let slashParsedData = Utils.parseSlashCommands(this.commandData.SlashCommand.Data);
                            if (slashParsedData && slashParsedData.name && slashParsedData.description) {
                                client.SlashCmdsData.push(slashParsedData);
                                client.SlashCmds.push(this);
                            }
                        }
                    }
                }
            }
            return this;
        }
    },
    /**
     * @param {commandStructure} data 
     */
    set: (data) => {
        let cmd = new module.exports.Command(data);
        if (data.run && isFunction(data.run)) cmd.setRun(data.run);
        if (data.runSlash && isFunction(data.runSlash)) cmd.setRunSlash(data.runSlash);
        cmd.registerCommand();
    },
    init: () => {
        const commandFolders = fs.readdirSync(path.join(__dirname, "../../Commands"));
        for (let dir = 0; dir < commandFolders.length; dir++) {
            let subCommandFolder = fs.readdirSync(path.join(__dirname, "../../Commands", commandFolders[dir]));
            for (let i = 0; i < subCommandFolder.length; i++) {
                const file = require(`../../Commands/${commandFolders[dir]}/${subCommandFolder[i]}`);
                if (file && file.name && file.type && file.commandData && file.run && file.runSlash) {
                    module.exports.set(file);
                }
            }
        }
        return true;
    }
}