const Discord = require("discord.js"),
    Utils = require("../Modules/Utils");

module.exports = async (bot, interaction) => {
    const { config, lang, SlashCmds } = bot;
    let permissions = [];
    // Slash Command Executing
    if (interaction.isCommand()) {
        const command = SlashCmds.find(
            (x) =>
                x.commandData.SlashCommand.Data.Name.toLowerCase() ==
                interaction.commandName.toLowerCase()
        );
        if (command && typeof command.runSlash == "function") {
            if (command.commandData.Permission) {
                if (typeof command.commandData.Permission == "string") {
                    if (Utils.hasRole(interaction.member, role, true)) {
                        permissions.push(true);
                    } else {
                        permissions.push(false);
                    }
                } else if (command.commandData.Permission[0]) {
                    for (const role of command.commandData.Permission) {
                        if (Utils.hasRole(interaction.member, role, true)) {
                            permissions.push(true);
                        } else {
                            permissions.push(false);
                        }
                    }
                } else {
                    permissions.push(true);
                }

                let options =
                    interaction.options && interaction.options._hoistedOptions
                        ? Utils.parseSlashArgs(
                              interaction.options._hoistedOptions
                          )
                        : {};

                if (permissions.includes(true) || permissions.length == 0) {
                    let commandUsed = interaction.commandName,
                        commandData = command;
                    command.runSlash(bot, interaction, options, {
                        commandUsed,
                        commandData,
                    });
                } else {
                    interaction.reply(
                        Utils.setupMessage(
                            {
                                configPath: lang.Presets.NoPermission,
                                variables: [
                                    {
                                        searchFor: /{roles}/g,
                                        replaceWith:
                                            command.commandData.Permission.map(
                                                (r) => {
                                                    let role = Utils.findRole(
                                                        r,
                                                        interaction.guild,
                                                        true
                                                    );
                                                    if (role)
                                                        return `<@&${role.id}>`;
                                                }
                                            ).join(", "),
                                    },
                                    ...Utils.userVariables(interaction.member),
                                ],
                            },
                            true
                        )
                    );
                }
            }
        } else {
            let cmd = interaction.guild.commands.cache.find(
                (x) =>
                    x.name.toLowerCase() ==
                    interaction.commandName.toLowerCase()
            );
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
