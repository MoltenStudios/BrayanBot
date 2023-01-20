import { CommandData, CommandInterface, CommandConfig } from "../Interfaces/Command.js";
import { ChatInputCommandInteraction, AutocompleteInteraction, Message } from "discord.js";
import { manager } from "../../../index.js";
import { readdirSync, lstatSync } from "fs";
import { BrayanBot } from "../BrayanBot.js";
import Utils from "../../Utils.js";
import path from "path";

export class CommandHandler {
    /** @type {BrayanBot} */ manager;
    /** @type {string} */ commandDir;
    /** @type {string[]} */ commandDirFiles;

    /** @param {BrayanBot} manager @param {string} commandDir */
    constructor(manager, commandDir) {
        if (!manager) throw new Error("[BrayanBot/CommandHandler] Missing manager parameter.");
        if (!commandDir) throw new Error("[BrayanBot/CommandHandler] Missing commandDir parameter.");

        this.manager = manager;
        this.commandDir = commandDir;
        this.commandDirFiles = readdirSync(commandDir);

        return this;
    }

    async initialize() {
        for (let i = 0; i < this.commandDirFiles.length; i++) {
            const isDir = lstatSync(path.join(this.commandDir, this.commandDirFiles[i])).isDirectory();
            if (!isDir) continue;

            const dirFiles = readdirSync(path.join(this.commandDir, this.commandDirFiles[i])).filter(x => x.endsWith(".js"))
            for (let y = 0; y < dirFiles.length; y++) {
                import(`file://` + path.join(this.commandDir, this.commandDirFiles[i], dirFiles[y])).then((module) => {
                    const command = module.default;
                    this.manager.commands.set(command.commandData.Name, command);
                });
            }
        }

        return this;
    }
}

export class Command {
    /** @type {CommandData} */ commandData;
    /** @type {CommandConfig} */ commandConfig;
    /** @type {((manager: BrayanBot, message: Message, args: string[], prefixUsed: string, commandData: CommandData) => any) | undefined} */ LegacyRun;
    /** @type {((manager: BrayanBot, interaction: ChatInputCommandInteraction, commandData: CommandData) => any) | undefined} */ InteractionRun;
    /** @type {((manager: BrayanBot, interaction: AutocompleteInteraction) => any) | undefined} */ AutoComplete;

    /** @param {CommandInterface} command */
    constructor(command) {
        this.commandData = command.commandData;
        this.commandConfig = command.commandConfig

        if (command.LegacyRun && typeof command.LegacyRun == "function")
            this.LegacyRun = command.LegacyRun;
        if (command.InteractionRun && typeof command.InteractionRun == "function")
            this.InteractionRun = command.InteractionRun;
        if (command.AutoComplete && typeof command.AutoComplete == "function")
            this.AutoComplete = command.AutoComplete;

        if (Array.isArray(this.commandData.Arguments)) {
            const parsedSlashCommand = Utils.setupSlashCommand({
                Name: this.commandData.Name,
                Description: this.commandData.Description,
                Options: this.commandData.Arguments
            });

            manager.slashCommands.set(this.commandData.Name, parsedSlashCommand);
        }

        if (this.LegacyRun || this.InteractionRun)
            manager.commands.set(command.commandData.Name, this);

        return this;
    }

    /** @param {((manager: BrayanBot, message: Message, args: string[], prefixUsed: string, commandData: Object) => any) | undefined} execute */
    runLegacyRun(execute) { if (execute && typeof execute == "function") this.LegacyRun = execute; return this; }

    /** @param {((manager: BrayanBot, interaction: ChatInputCommandInteraction, commandData: Object) => any) | undefined} execute */
    runInteractionRun(execute) { if (execute && typeof execute == "function") this.InteractionRun = execute; return this; }

    /** @param {((manager: BrayanBot, interaction: AutocompleteInteraction) => any) | undefined} execute */
    runAutoComplete(execute) { if (execute && typeof execute == "function") this.AutoComplete = execute; return this; }

    registerCommand() {
        if (Array.isArray(this.commandData.Arguments)) {
            const parsedSlashCommand = Utils.setupSlashCommand({
                Name: this.commandData.Name,
                Description: this.commandData.Description,
                Options: this.commandData.Arguments
            });

            manager.slashCommands.set(this.commandData.Name, parsedSlashCommand);
        }

        manager.commands.set(command.commandData.Name, this);
    }
}