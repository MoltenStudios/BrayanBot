import { EventListener } from "../Modules/Structures/Handlers/Events.js";
import Cooldown from "../Modules/Structures/Handlers/Cooldown.js";
import { Proxima } from "../Modules/Structures/Proxima.js";
import Utils from "../Modules/Utils.js";
import Discord from "discord.js";
import ms from "ms"

const { Interaction, ChannelType } = Discord;
/** @param {Proxima} bot @param {Interaction} interaction */
const execute = async (bot, interaction) => {
    const { config, lang } = bot.configs;

    if (interaction.isChatInputCommand()) {
        const command = interaction.commandName;

        const cmd = bot.commands.get(command);
        if (cmd && cmd.commandData.Enabled == true) {
            if (cmd.commandData.Cooldown && !interaction.user.bot) {
                const cooldown = ms(cmd.commandData.Cooldown);
                const isOnCooldown = Cooldown.getCooldown(cmd.commandData.Name, interaction.member.id)

                if (isOnCooldown && isOnCooldown.time - Date.now() < 0) {
                    Cooldown.resetCooldown(cmd.commandData.Name, interaction.member.id, cooldown)
                } else if (isOnCooldown) {
                    return interaction.reply(Object.assign(Utils.setupMessage({
                        configPath: lang.Miscellaneous.CommandOnCooldown,
                        variables: [
                            ...Utils.userVariables(interaction.member, 'user'),
                            { searchFor: /{cooldown}/g, replaceWith: ms(isOnCooldown.time - Date.now(), { long: true }) },
                            { searchFor: /{time}/g, replaceWith: Math.ceil(isOnCooldown.time / 1000) },
                            { searchFor: /{command}/g, replaceWith: command.slice(config.Settings.Prefix.length) }
                        ]
                    }), { ephemeral: true }))
                } else if (!isOnCooldown) {
                    Cooldown.createCooldown(cmd.commandData.Name, interaction.member.id, cooldown)
                }
            }

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
    } else if (interaction.isAutocomplete()) {
        const command = interaction.commandName;

        const cmd = bot.commands.get(command);
        if (cmd && cmd.AutoComplete && typeof cmd.AutoComplete == "function") {
            await cmd.AutoComplete.call(this, bot, interaction);
        }
    }
}

export default new EventListener("interactionCreate", execute)