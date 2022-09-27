import { Guild, GuildChannel, GuildMember, InteractionReplyOptions } from "discord.js";
import { Command } from "../../Modules/Structures/Handlers/Commands";
import Utils from "../../Modules/Utils";
import { manager } from "../../index";
import os from "os";
import ms from "ms";

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
        const { lang } = manager.configs;
        const subCommand = interaction.options.getSubcommand();
        
        switch(subCommand) {
            case "bot": {
                interaction.reply(Utils.setupMessage({
                    configPath: lang.General.Info.BotInfo,
                    variables: [
                        ...Utils.botVariables(manager),
                        ...Utils.guildVariables(interaction.guild as Guild),
                        ...Utils.userVariables(interaction.member as GuildMember),
                        ...Utils.channelVariables(interaction.channel as GuildChannel),
                        { searchFor: /{uptime}/g, replaceWith: ms(os.uptime() * 1000, { long: true }) },
                        { searchFor: /{botRamUsage}/g, replaceWith: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0) },
                        { searchFor: /{botMaxRam}/g, replaceWith: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(0) },
                        { searchFor: /{botUptime}/g, replaceWith: ms(manager.uptime!, { long: true }) },
                    ],
                }) as InteractionReplyOptions)
                break;
            }

            case "guild": {

                break;
            }

            case "user": {
                const user = interaction.options.getMember("user") || interaction.member;
                
                break;
            }

            case "channel": {
                const channel = interaction.options.getChannel("channel", false) || interaction.channel;
                
                break;
            }
        }
    },
});