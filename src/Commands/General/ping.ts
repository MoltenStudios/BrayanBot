import { Command } from "../../Modules/Structures/Handlers/Commands";

export default new Command({
    commandData: {
        Name: "ping",
        Usage: 'ping',
        Cooldown: 0,
        Permission: ["@everyone"],
        Description: "KOOL",
        DeleteCommand: false,
        SlashCommand: {
            Enabled: false,
            Data: {}
        }
    },
    runLegacy(manager, message, args, prefixUsed, commandData) {
        message.reply("Lol")
    },
    runSlash(manager, interaction, options, commandData) {
        interaction.reply("lol")
    },
});