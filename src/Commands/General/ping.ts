import { Command } from "../../Modules/Structures/Handlers/Commands";
import Utils from "../../Modules/Utils";

export default new Command({
    commandData: {
        Name: "ping",
        Usage: 'ping',
        Cooldown: 0,
        Permission: ["Zorino#1110"],
        Description: "KOOL",
        DeleteCommand: false,
        SlashCommand: {
            Enabled: false,
            Data: {}
        }
    },
    runLegacy(manager, message, args, prefixUsed, commandData) {
        message.reply(Utils.setupMessage({
            configPath: {
                Content: "Test from setupMessage",
                Embeds: [{
                    Title: "title test",
                    Description: "description test",
                    Footer: "footer tst",
                    Author: "author test",
                    Timestamp: true
                }],
                Components: {
                    "1": [
                        {
                            Type: "Button",
                            Style: "Link",
                            Link: "https://zorino.in/",
                            Label: "link",
                            CustomID: "link lol",
                            Emoji: "👀"
                        }
                    ]
                }
            }
        }))
    },
    runSlash(manager, interaction, options, commandData) {
        interaction.reply("hii :wave:")
    },
});