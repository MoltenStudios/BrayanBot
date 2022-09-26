import { ChannelType, Message } from "discord.js";
import { BrayanBot } from "../Modules/Structures/BrayanBot";
import { EventListener } from "../Modules/Structures/Handlers/Events";
import Utils from "../Modules/Utils";

export default new EventListener("messageCreate", async (bot: BrayanBot, message: Message) => {
    const { config, lang } = bot.configs;
    
    let prefixUsed: string | undefined;
    if(message.content && Array.isArray(config?.Settings.Prefix)) {
        prefixUsed = config?.Settings.Prefix.find(prefix => {
            return message.content.toLowerCase().startsWith(prefix.toLowerCase())
        }) as string;
    } else if(message.content && typeof config?.Settings.Prefix == "string") {
        prefixUsed = config?.Settings.Prefix;
    }
    
    if(prefixUsed) {
        if(!config?.Settings.IgnoreBots && message.author.bot) return;
        
        const msg = message.content.split(" ");
        const command = msg[0].toLowerCase().replace(prefixUsed, "");
        const args = msg.slice(1);

        const cmd = bot.commands.get(command);
        if(cmd && cmd.commandData.Enabled == true && cmd.LegacyRun) {
            if(cmd.commandConfig.dmOnly && message.channel.type !== ChannelType.DM) {
                return message.reply(Utils.setupMessage({
                    configPath: lang?.Miscellaneous.DMOnly!,
                    variables: Utils.userVariables(message.member!)
                }))
            }
            
            if(cmd.commandConfig.guildOnly && ![
                ChannelType.GuildAnnouncement, ChannelType.GuildCategory, ChannelType.PrivateThread, 
                ChannelType.GuildDirectory, ChannelType.GuildForum, ChannelType.PublicThread,
                ChannelType.GuildStageVoice, ChannelType.GuildText, ChannelType.GuildVoice,
                ChannelType.AnnouncementThread
            ].includes(message.channel.type)) {
                return message.reply(Utils.setupMessage({
                    configPath: lang?.Miscellaneous.GuildOnly!,
                    variables: Utils.userVariables(message.member!)
                }))
            }

            if(cmd.commandConfig.requiredPermissions.user) {
                if(!message.member?.permissions.has(cmd.commandConfig.requiredPermissions.user)) {
                    return message.reply(Utils.setupMessage({
                        configPath: lang?.Miscellaneous.InvalidUserPermissions!,
                        variables: Utils.userVariables(message.member!)
                    }))
                }
            }

            if(cmd.commandConfig.requiredPermissions.bot) {
                if(!message.guild?.members.me?.permissions.has(cmd.commandConfig.requiredPermissions.bot)) {
                    return message.reply(Utils.setupMessage({
                        configPath: lang?.Miscellaneous.InvalidBotPermissions!,
                        variables: Utils.userVariables(message.member!)
                    }))
                }
            }
            
            if(cmd.commandData.Permission && !Utils.hasPermission(cmd.commandData.Permission, message.member!)) {
                return message.reply(Utils.setupMessage({
                    configPath: lang?.Miscellaneous.InvalidRolePermissions!,
                    variables: Utils.userVariables(message.member!)
                }))
            }
    
            await cmd.LegacyRun.call(this, bot, message, args, prefixUsed, cmd)
        }
    }

    if(bot.user && message.content.toLowerCase().startsWith(`<@${bot.user.id}>`) 
        && !message.content.replace(`<@${bot.user.id}>`, "")) {
        const ctn = message.content.replace(`<@${bot.user.id}>`, "");
        if(ctn == "") message.reply(Utils.setupMessage({
            configPath: lang?.TagEmbed!,
            variables: Utils.userVariables(message.member!)
        }))
    }
})