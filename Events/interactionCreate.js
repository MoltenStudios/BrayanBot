const Utils = require("../Modules/Utils");
const Discord = require("discord.js");
const chalk = require("chalk");
const ms = require("ms");

let db;
/**
 * @param {Discord.Client} bot 
 * @param {Discord.Interaction} interaction 
 */
module.exports = async (bot, interaction) => {
    if (!db) db = await Utils.database.getDatabase();
    const { config, lang, SlashCmds } = bot;
    // Slash Command Executing
    if (interaction.isCommand()) {
        const command = SlashCmds.find((x) => x.commandData.SlashCommand.Data.Name.toLowerCase() == interaction.commandName.toLowerCase());
        let permissions = [], ignoreCooldown = false;

        if (command && typeof command.runSlash == "function") {
            // Command Cooldown Check
            if (command.commandData.Cooldown && !interaction.user.bot) {
                const ignoreUserCheck = bot.commands.IgnoredCooldown.Users ? bot.commands.IgnoredCooldown.Users.includes(x => x.id == interaction.user.id
                    || x.tag.toLowerCase() == interaction.user.tag.toLowerCase()
                    || x.username.toLowerCase() == interaction.user.username.toLowerCase()) : false;

                const ignoreRoleCheck = bot.commands.IgnoredCooldown.Roles ? bot.commands.IgnoredCooldown.Roles.includes(x =>
                    interaction.member.roles.cache.some(y => y.id == x
                        || y.name.toLowerCase() == x.toLowerCase())) : false;

                if (ignoreUserCheck || ignoreRoleCheck) ignoreCooldown = true;

                const cooldown = ms(command.commandData.Cooldown);
                const isOnCooldown = db.prepare(`SELECT * FROM cooldowns WHERE user=? AND command=?`).get(interaction.user.id, command.name);


                if (ignoreCooldown == false) {
                    if (isOnCooldown && isOnCooldown.time - Date.now() < 0) {
                        Utils.database.cooldowns.reset(command.name, interaction.user.id, cooldown)
                    } else if (isOnCooldown) {
                        return interaction.reply(Utils.setupMessage({
                            configPath: lang.Presets.OnCooldown,
                            variables: [
                                ...Utils.userVariables(interaction.member, 'user'),
                                { searchFor: /{cooldown}/g, replaceWith: ms(isOnCooldown.time - Date.now(), { long: true }) },
                                { searchFor: /{command}/g, replaceWith: command.name }
                            ]
                        }))
                    } else if (!isOnCooldown) {
                        Utils.database.cooldowns.set(command.name, interaction.user.id, cooldown)
                        db.prepare(`INSERT INTO cooldowns (user, command, time)VALUES(?,?,?)`).run(interaction.user.id, command.name, (Date.now() + cooldown));
                    }
                }
            }

            // Command Channel Check
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
            };

            // Command Permission Check
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
                    else if (Utils.hasRole(interaction.member, permission, false)) permissions.push(true);
                })
            };

            if (permissions.includes(true)) {
                let options = interaction.options && interaction.options._hoistedOptions ? Utils.parseSlashArgs(interaction.options._hoistedOptions) : {};
                await command.runSlash(bot, interaction, options, {
                    commandUsed: interaction.commandName,
                    commandData: command
                });
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
            interaction.reply({ content: "This command no longer exists.", ephemeral: true });
        }
    } else if (interaction.isButton()) {
        bot.emit("interactionCreate-Button", interaction);
    } else if (interaction.isSelectMenu()) {
        bot.emit("interactionCreate-SelectMenu", interaction);
    } else if (interaction.isAutocomplete()) {
        bot.emit("interactionCreate-AutoComplete", interaction);
    }
};
module.exports.once = false;
