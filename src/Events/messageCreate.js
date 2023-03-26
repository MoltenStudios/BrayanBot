import { EventListener } from "../Modules/Structures/Handlers/Events.js";
import Cooldown from "../Modules/Structures/Handlers/Cooldown.js";
import { BrayanBot } from "../Modules/Structures/BrayanBot.js";
import { ChannelType, Message } from "discord.js";
import Utils from "../Modules/Utils.js";
import ms from "ms"

/** @param {BrayanBot} bot @param {Message} message */
const execute = async (bot, message) => {
    const { config, lang } = bot.configs;

    let prefixUsed;
    if (message.content && Array.isArray(config?.Settings.Prefix)) {
        prefixUsed = config?.Settings.Prefix.find(prefix => {
            return message.content.toLowerCase().startsWith(prefix.toLowerCase())
        });
    } else if (message.content && typeof config?.Settings.Prefix == "string") {
        prefixUsed = config?.Settings.Prefix;
    }

    if (prefixUsed) {
        if (!config?.Settings.IgnoreBots && message.author.bot) return;

        const msg = message.content.split(" ");
        const command = msg[prefixUsed.includes(" ") ? 1 : 0].toLowerCase().replace(prefixUsed, "");
        const args = msg.slice(prefixUsed.includes(" ") ? 2 : 1);

        const cmd = bot.commands.get(bot.aliases.get(command) || command)
        if (cmd && cmd.commandData.Enabled == true && cmd.LegacyRun) {
            if (cmd.commandData.Cooldown && !message.author.bot) {
                const cooldown = ms(cmd.commandData.Cooldown);
                const isOnCooldown = Cooldown.getCooldown(cmd.commandData.Name, message.author.id)

                if (isOnCooldown && isOnCooldown.time - Date.now() < 0) {
                    Cooldown.resetCooldown(cmd.commandData.Name, message.author.id, cooldown)
                } else if (isOnCooldown) {
                    return message.reply(Utils.setupMessage({
                        configPath: lang.Miscellaneous.CommandOnCooldown,
                        variables: [
                            ...Utils.userVariables(message.member, 'user'),
                            { searchFor: /{cooldown}/g, replaceWith: ms(isOnCooldown.time - Date.now(), { long: true }) },
                            { searchFor: /{time}/g, replaceWith: Math.ceil(isOnCooldown.time / 1000) },
                            { searchFor: /{command}/g, replaceWith: command.slice(config.Settings.Prefix.length) }
                        ]
                    }))
                } else if (!isOnCooldown) {
                    Cooldown.createCooldown(cmd.commandData.Name, message.author.id, cooldown)
                }
            }

            if (cmd.commandConfig.dmOnly && message.channel.type !== ChannelType.DM) {
                return message.reply(Utils.setupMessage({
                    configPath: lang.Miscellaneous.DMOnly,
                    variables: Utils.userVariables(message.member)
                }))
            }

            if (cmd.commandConfig.guildOnly && ![
                ChannelType.GuildAnnouncement, ChannelType.GuildCategory, ChannelType.PrivateThread,
                ChannelType.GuildDirectory, ChannelType.GuildForum, ChannelType.PublicThread,
                ChannelType.GuildStageVoice, ChannelType.GuildText, ChannelType.GuildVoice,
                ChannelType.AnnouncementThread
            ].includes(message.channel.type)) {
                return message.reply(Utils.setupMessage({
                    configPath: lang.Miscellaneous.GuildOnly,
                    variables: Utils.userVariables(message.member)
                }))
            }

            if (cmd.commandConfig.requiredPermissions.user) {
                if (!message.member?.permissions.has(cmd.commandConfig.requiredPermissions.user)) {
                    return message.reply(Utils.setupMessage({
                        configPath: lang.Miscellaneous.InvalidUserPermissions,
                        variables: Utils.userVariables(message.member)
                    }))
                }
            }

            if (cmd.commandConfig.requiredPermissions.bot) {
                if (!message.guild?.members.me?.permissions.has(cmd.commandConfig.requiredPermissions.bot)) {
                    return message.reply(Utils.setupMessage({
                        configPath: lang.Miscellaneous.InvalidBotPermissions,
                        variables: Utils.userVariables(message.member)
                    }))
                }
            }

            if (cmd.commandData.Permission && !Utils.hasPermission(cmd.commandData.Permission, message.member)) {
                return message.reply(Utils.setupMessage({
                    configPath: lang.Miscellaneous.InvalidRolePermissions,
                    variables: Utils.userVariables(message.member)
                }))
            }

            await cmd.LegacyRun.call(this, bot, message, args, prefixUsed, cmd)
        }
    }

    if (bot.user && message.content.toLowerCase().startsWith(`<@${bot.user.id}>`)
        && !message.content.replace(`<@${bot.user.id}>`, "")) {
        const ctn = message.content.replace(`<@${bot.user.id}>`, "");
        if (ctn == "") message.reply(Utils.setupMessage({
            configPath: lang.TagEmbed,
            variables: Utils.userVariables(message.member)
        }))
    }
}

export default new EventListener("messageCreate", execute)