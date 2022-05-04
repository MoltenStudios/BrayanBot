const Discord = require("discord.js"),
    Utils = require("../Modules/Utils"),
    chalk = require("chalk");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Interaction} interaction 
 */
module.exports = async (bot, interaction) => {
    const { config, lang, SlashCmds } = bot;
    // Slash Command Executing
    if (interaction.isCommand()) {
        const command = SlashCmds.find((x) => x.commandData.SlashCommand.Data.Name.toLowerCase() == interaction.commandName.toLowerCase());
        if (command && typeof command.runSlash == "function") {
            if (command.commandData.AllowedChannels) {
                if (typeof command.commandData.AllowedChannels == "string")
                    command.commandData.AllowedChannels = [command.commandData.AllowedChannels];

                let isAllowed = [], allowedChannels = [];
                for (let index = 0; index < command.commandData.AllowedChannels.length; index++) {
                    let channel = Utils.findChannel(command.commandData.AllowedChannels[index], interaction.guild, "GUILD_TEXT", true)
                    if (channel) {
                        allowedChannels.push(Utils.builder.channelMention(channel.id))
                        if (interaction.channel.id == channel.id) isAllowed.push(true)
                    }
                }
                if (!isAllowed.includes(true)) {
                    return interaction.reply(Utils.setupMessage({
                        configPath: lang.Presets.NonCommandChannel,
                        variables: [
                            { searchFor: /{channels}/g, replaceWith: allowedChannels.join(", ") },
                            ...Utils.userVariables(interaction.member),
                        ],
                    }, true))
                }
            }

            let permissions = [];
            if (command.commandData.Permission) {
                if (typeof command.commandData.Permission == "string")
                    command.commandData.Permission = [command.commandData.Permission];
                else if (!command.commandData.Permission[0]) command.commandData.Permission = ["@everyone"];

                if (command.commandData.Permission.includes("@everyone") || command.commandData.Permission.includes("everyone"))
                    permissions.push(true);
                else command.commandData.Permission.forEach(permission => {
                    const roleExists = Utils.findRole(permission, interaction.guild, false);
                    const userExists = Utils.parseUser(permission, interaction.guild);

                    if (!roleExists && !userExists)
                        Utils.logWarning(`${chalk.bold(permission)} is not a valid ${chalk.bold('role/user')} permission in command ${chalk.bold(command.name)}`)

                    if (userExists && userExists.id === interaction.user.id) permissions.push(true);
                    else if(Utils.hasRole(interaction.member, permission, false)) permissions.push(true);
                })
            }

            if (permissions.includes(true)) {
                let options = interaction.options && interaction.options._hoistedOptions ? Utils.parseSlashArgs(interaction.options._hoistedOptions) : {};
                let commandUsed = interaction.commandName, commandData = command;
                await command.runSlash(bot, interaction, options, { commandUsed, commandData });
            } else {
                interaction.reply(Utils.setupMessage({
                    configPath: lang.Presets.NoPermission,
                    variables: [
                        ...Utils.userVariables(interaction.member),
                        {
                            searchFor: /{perms}/g, replaceWith: permissions[0] ? command.commandData.Permission.map((x) => {
                                if (!!Utils.findRole(x, interaction.guild, false)) {
                                    let role = Utils.findRole(x, interaction.guild, true);
                                    if (role) return Utils.builder.roleMention(role.id);
                                }
                                if (!!Utils.parseUser(x, interaction.guild)) {
                                    let user = Utils.parseUser(x, interaction.guild, true);
                                    if (user) return Utils.builder.userMention(user.id);
                                }
                            }).join(", ") : "Invalid Permissions configured.",
                        },
                    ],
                }));
            }

        } else {
            let cmd = interaction.guild.commands.cache.find((x) =>
                x.name.toLowerCase() == interaction.commandName.toLowerCase());
            if (cmd) cmd.delete();
            interaction.reply({
                content: "This command no longer exists.",
                ephemeral: true,
            });
        }
    } else if (interaction.isButton()) {
        bot.emit("interactionCreate-Button", interaction);
    } else if (interaction.isSelectMenu()) {
        bot.emit("interactionCreate-SelectMenu", interaction);
    }
};
module.exports.once = false;
