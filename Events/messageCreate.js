const Discord = require("discord.js"),
    Utils = require("../Modules/Utils"),
    { roleMention } = require("@discordjs/builders");

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
                    const permissionRole = !!Utils.findRole(permission, message.guild, false),
                        permissionUser = !!Utils.parseUser(permission, message.guild, false);

                    if (!permissionRole && !permissionUser)
                        return Utils.logError(`${chalk.bold(perm)} role/user was not found in ${chalk.bold(message.guild.name)} guild`);

                    if (permissionRole) Utils.hasRole(message.member, permission, true)
                        ? permissions.push(true) : permissions.push(false);

                    if (permissionUser) {
                        const parsedUser = Utils.parseUser(permission, message.guild, true)
                        parsedUser && message.member == parsedUser.id
                            ? permissions.push(true) : permissions.push(false);
                    }
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
                        searchFor: /{roles}/g, replaceWith: commands.commandData.Permission.map((x) => {
                            if (!!Utils.findRole(x, message.guild, false)) {
                                let role = Utils.findRole(x, message.guild, true);
                                return roleMention(role.id);
                            }
                        }).join(", "),
                    },
                ],
            }));
        }
    }
};
module.exports.once = false;
