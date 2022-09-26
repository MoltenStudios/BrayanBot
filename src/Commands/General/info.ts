import { Command } from "../../Modules/Structures/Handlers/Commands";
import { InteractionReplyOptions } from "discord.js";
import Utils from "../../Modules/Utils";
import { manager } from "../../index";

export default new Command({
    commandData: manager.configs.commands.General.Info,
    commandConfig: {
        dmOnly: false,
        guildOnly: true,
        requiredPermissions: {
            user: [],
            bot: []
        }
    },
    LegacyRun: async (manager, message, args, prefixUsed, commandData) => {
    },
    InteractionRun: async (manager, interaction, commandData) => {
        // const subCommand = interaction.options.getSubcommand();
    },
});