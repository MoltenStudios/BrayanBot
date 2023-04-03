import { SlashCommandOption } from "../../Utils/setupSlashCommand.js";
import { Message, ChatInputCommandInteraction } from "discord.js";
import { Proxima } from "../Proxima.js";

const CommandConfig = {
    guildOnly: Boolean,
    dmOnly: Boolean,
    requiredPermissions: {
        user: [String],
        bot: [String]
    }
}

const CommandData = {
    Enabled: Boolean,
    Name: String,
    Usage: String,
    Type: String,
    Cooldown: Number,
    Aliases: Array,
    Permission: [String],
    Description: String,
    DeleteCommand: Boolean,
    Arguments: [SlashCommandOption]
}

const CommandInterface = {
    /** @type {CommandData} */
    commandData: CommandData,
    /** @type {CommandConfig} */
    commandConfig: CommandConfig,
    /** 
     * @param {Proxima} manager @param {Message} message @param {String[]} args 
     * @param {String} prefixUsed @param {String} commandData */
    LegacyRun: (manager, message, args, prefixUsed, commandData) => { },
    /**
     * @param {Proxima} manager @param {ChatInputCommandInteraction} interaction 
     * @param {CommandData} commandData */
    InteractionRun: (manager, interaction, commandData) => { },
    /**
     * @param {Proxima} manager 
     * @param {AutocompleteInteraction} interaction 
     */
    AutoComplete: (manager, interaction) => { }
}

export { CommandData, CommandInterface, CommandConfig }