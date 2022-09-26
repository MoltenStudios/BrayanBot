import { ChannelType, CommandInteraction, GuildMember, Interaction, InteractionReplyOptions } from "discord.js";
import { BrayanBot } from "../Modules/Structures/BrayanBot";
import { EventListener } from "../Modules/Structures/Handlers/Events";
import Utils from "../Modules/Utils";

export default new EventListener("interactionCreate", async (bot: BrayanBot, interaction: Interaction) => {
    const { config, lang } = bot.configs;

    if(interaction.isChatInputCommand()) {
        const command = interaction.commandName;
        
        const cmd = bot.commands.get(command);
        if(cmd && cmd.commandData.Enabled == true) {
            if(cmd.commandConfig.dmOnly && interaction.channel?.type !== ChannelType.DM) {
                return interaction.reply(Utils.setupMessage({
                    configPath: lang?.Miscellaneous.DMOnly!,
                    variables: Utils.userVariables(interaction.member as GuildMember)
                }) as InteractionReplyOptions)
            }
            
            if(interaction.channel?.type && cmd.commandConfig.guildOnly && ![
                ChannelType.GuildAnnouncement, ChannelType.GuildCategory, ChannelType.PrivateThread, 
                ChannelType.GuildDirectory, ChannelType.GuildForum, ChannelType.PublicThread,
                ChannelType.GuildStageVoice, ChannelType.GuildText, ChannelType.GuildVoice,
                ChannelType.AnnouncementThread
            ].includes(interaction.channel.type)) {
                return interaction.reply(Utils.setupMessage({
                    configPath: lang?.Miscellaneous.GuildOnly!,
                    variables: Utils.userVariables(interaction.member as GuildMember)
                }) as InteractionReplyOptions)
            }

            if(cmd.commandConfig.requiredPermissions.user) {
                if(!interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has(cmd.commandConfig.requiredPermissions.user)) {
                    return interaction.reply(Utils.setupMessage({
                        configPath: lang?.Miscellaneous.InvalidUserPermissions!,
                        variables: Utils.userVariables(interaction.member as GuildMember)
                    }) as InteractionReplyOptions)
                }
            }

            if(cmd.commandConfig.requiredPermissions.bot) {
                if(!interaction.guild?.members.me?.permissions.has(cmd.commandConfig.requiredPermissions.bot)) {
                    return interaction.reply(Utils.setupMessage({
                        configPath: lang?.Miscellaneous.InvalidBotPermissions!,
                        variables: Utils.userVariables(interaction.member as GuildMember)
                    }) as InteractionReplyOptions)
                }
            }
            
            if(cmd.commandData.Permission && !Utils.hasPermission(cmd.commandData.Permission, interaction.member as GuildMember)) {
                return interaction.reply(Utils.setupMessage({
                    configPath: lang?.Miscellaneous.InvalidRolePermissions!,
                    variables: Utils.userVariables(interaction.member as GuildMember)
                }) as InteractionReplyOptions)
            }
    
            await cmd.InteractionRun?.call(this, bot, interaction, [{}], cmd);
        }
    }
})