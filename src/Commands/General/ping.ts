import { Command } from "../../Modules/Structures/Handlers/Commands";

export default new Command({
    runLegacy(manager, message, args, prefixUsed, commandData) {},
    runSlash(manager, interaction, options, commandData) {},
    commandData: {
        Name: "ping",
        SlashCommand: {
            Enabled: false,
            Data: {}
        }
    },
});