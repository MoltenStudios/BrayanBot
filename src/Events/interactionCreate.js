import { EventListener } from "../Modules/Structures/Handlers/Events.js";
import { BrayanBot } from "../Modules/Structures/BrayanBot.js";
import Discord from "discord.js";
import Utils from "../Modules/Utils.js";
const { ChannelType, Interaction } = Discord

/** @param {BrayanBot} bot @param {Interaction} interaction */
const execute = async (bot, interaction) => {
    const { config, lang } = bot.configs;

    if (interaction.isChatInputCommand()) {
        const command = interaction.commandName;

        const cmd = bot.commands.get(command);
        if (cmd && cmd.commandData.Enabled == true) {
            if (cmd.commandConfig.dmOnly && interaction.channel?.type !== ChannelType.DM) {
                return interaction.reply(Utils.setupMessage({
                    configPath: lang.Miscellaneous.DMOnly,
                    variables: Utils.userVariables(interaction.member)
                }))
            }

            if (interaction.channel?.type && cmd.commandConfig.guildOnly && ![
                ChannelType.GuildAnnouncement, ChannelType.GuildCategory, ChannelType.PrivateThread,
                ChannelType.GuildDirectory, ChannelType.GuildForum, ChannelType.PublicThread,
                ChannelType.GuildStageVoice, ChannelType.GuildText, ChannelType.GuildVoice,
                ChannelType.AnnouncementThread
            ].includes(interaction.channel.type)) {
                return interaction.reply(Utils.setupMessage({
                    configPath: lang.Miscellaneous.GuildOnly,
                    variables: Utils.userVariables(interaction.member)
                }))
            }

            if (cmd.commandConfig.requiredPermissions.user) {
                if (!interaction.guild?.members.cache.get(interaction.user.id)?.permissions.has(cmd.commandConfig.requiredPermissions.user)) {
                    return interaction.reply(Utils.setupMessage({
                        configPath: lang.Miscellaneous.InvalidUserPermissions,
                        variables: Utils.userVariables(interaction.member)
                    }))
                }
            }

            if (cmd.commandConfig.requiredPermissions.bot) {
                if (!interaction.guild?.members.me?.permissions.has(cmd.commandConfig.requiredPermissions.bot)) {
                    return interaction.reply(Utils.setupMessage({
                        configPath: lang.Miscellaneous.InvalidBotPermissions,
                        variables: Utils.userVariables(interaction.member)
                    }))
                }
            }

            if (cmd.commandData.Permission && !Utils.hasPermission(cmd.commandData.Permission, interaction.member)) {
                return interaction.reply(Utils.setupMessage({
                    configPath: lang.Miscellaneous.InvalidRolePermissions,
                    variables: Utils.userVariables(interaction.member)
                }))
            }

            await cmd.InteractionRun?.call(this, bot, interaction, cmd);
        }
    }
}

export default new EventListener("interactionCreate", execute)