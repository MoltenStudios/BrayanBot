import { Message, CommandInteraction } from "discord.js";
import { BrayanBot } from "../BrayanBot";

type CommandData = {
    Name: string
    Usage?: string
    Cooldown?: number
    Permission?: string[]
    Description?: string
    DeleteCommand?: boolean
    SlashCommand: {
        Enabled: boolean,
        Data: Object
    }
}

interface CommandInterface {
    commandData: {
        Name: string
        Usage?: string
        Cooldown?: number
        Permission?: string[]
        Description?: string
        DeleteCommand?: boolean
        SlashCommand: {
            Enabled: boolean,
            Data: Object
        }
    };
    LegacyRun?: (
        manager: BrayanBot, 
        message: Message, 
        args: string[], 
        prefixUsed: string, 
        commandData: Object
    ) => any;
    InteractionRun?: (
        manager: BrayanBot, 
        interaction: CommandInteraction, 
        options: Object[], 
        commandData: Object
    ) => any;
}

export { CommandData, CommandInterface }