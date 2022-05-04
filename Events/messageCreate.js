const Discord = require("discord.js"),
    Utils = require("../Modules/Utils"), chalk = require("chalk"),
    { roleMention, userMention } = require("@discordjs/builders");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} message 
 */
module.exports = async (bot, message) => {
    const { config, Commands, lang, Aliases } = bot;

    if (message.content.startsWith(config.Settings.Prefix)) {
        let msgArray = message.content.split(" "), command = msgArray[0].toLowerCase(),
            args = msgArray.slice(1), permissions = [];

        let commands = Commands.get(command.slice(config.Settings.Prefix.length))
            || Commands.get(Aliases.get(command.slice(config.Settings.Prefix.length)));

        if (commands && typeof commands.run == "function") {
            if (commands.commandData.AllowedChannels) {
                if (typeof commands.commandData.AllowedChannels == "string")
                    commands.commandData.AllowedChannels = [commands.commandData.AllowedChannels];
                else if (!commands.commandData.AllowedChannels[0]) commands.commandData.AllowedChannels = [];

                let isAllowed = [], channelIDs = [];
                commands.commandData.AllowedChannels.forEach(channel => {
                    const allowedChannel = Utils.findChannel(channel, message.guild, "GUILD_TEXT", true)
                    if (allowedChannel) {
                        if (message.channel.id == allowedChannel.id) isAllowed.push(true)
                        channelIDs.push(`<#${allowedChannel.id}>`)
                    }
                });

                if (!isAllowed.includes(true)) return message.reply(Utils.setupMessage({
                    configPath: lang.Presets.NonCommandChannel,
                    variables: [
                        { searchFor: /{channels}/g, replaceWith: channelIDs.join(", ") },
                        ...Utils.userVariables(message.member),
                    ],
                })).then(msg => setTimeout(() => {
                    message.delete().catch(e => { })
                    msg.delete().catch(e => { })
                }, 5000))
            }
            if (commands.commandData.Permission) {
                if (typeof commands.commandData.Permission == "string")
                    commands.commandData.Permission = [commands.commandData.Permission];
                else if (!commands.commandData.Permission[0]) commands.commandData.Permission = ["@everyone"];

                if (commands.commandData.Permission.includes("@everyone") || commands.commandData.Permission.includes("everyone"))
                    permissions.push(true);
                else commands.commandData.Permission.forEach(permission => {
                    const roleExists = Utils.findRole(permission, message.guild, false);
                    const userExists = Utils.parseUser(permission, message.guild);

                    if (!roleExists && !userExists)
                        Utils.logWarning(`${chalk.bold(permission)} is not a valid ${chalk.bold('role/user')} permission in command ${chalk.bold(command.name)}`)

                    if (userExists && userExists.id === message.author.id) permissions.push(true);
                    else if(Utils.hasRole(message.member, permission, false)) permissions.push(true);
                })
            }
            if (permissions.includes(true)) {
                await commands.run(bot, message, args, config);
                if (commands.commandData.DeleteCommand) message.delete().catch(e => { })
            } else message.reply(Utils.setupMessage({
                configPath: lang.Presets.NoPermission,
                variables: [
                    ...Utils.userVariables(message.member),
                    {
                        searchFor: /{perms}/g, replaceWith: permissions[0] ? commands.commandData.Permission.map((x) => {
                            if (!!Utils.findRole(x, message.guild, false)) {
                                let role = Utils.findRole(x, message.guild, true);
                                if (role) return roleMention(role.id);
                            }
                            if (!!Utils.parseUser(x, message.guild)) {
                                let user = Utils.parseUser(x, message.guild, true);
                                if (user) return userMention(user.id);
                            }
                        }).join(", ") : "Invalid Permissions configured.",
                    },
                ],
            }));
        }
    }
};
module.exports.once = false;