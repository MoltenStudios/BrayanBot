import { Message, ChatInputCommandInteraction, PermissionResolvable } from "discord.js";
import { SetupSlashCommand } from "../../Utils/setupSlashCommand";
import { BrayanBot } from "../BrayanBot";

type SlashCommandData = {
    Name: string,
    Description: string,
}

type CommandConfig = {
    guildOnly: boolean;
    dmOnly: boolean;
    requiredPermissions: {
        user: PermissionResolvable[],
        bot: PermissionResolvable[]
    }
}

type CommandData = {
    Enabled?: boolean
    Name: string
    Usage?: string
    Cooldown?: number
    Permission?: string[]
    Description?: string
    DeleteCommand?: boolean
    SlashCommand: {
        Enabled: boolean,
        Data: SetupSlashCommand
    }
}

interface CommandInterface {
    commandData: CommandData;
    commandConfig: CommandConfig;
    LegacyRun?: (
        manager: BrayanBot, 
        message: Message, 
        args: string[], 
        prefixUsed: string, 
        commandData: Object
    ) => any;
    InteractionRun?: (
        manager: BrayanBot, 
        interaction: ChatInputCommandInteraction, 
        commandData: Object
    ) => any;
}

export { CommandData, CommandInterface, SlashCommandData, CommandConfig }