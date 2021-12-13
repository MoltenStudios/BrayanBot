const Discord = require("discord.js"),
    Utils = require("../Modules/Utils"),
    { roleMention } = require("@discordjs/builders");

module.exports = async (bot, message) => {
    const { config, Commands, lang, Aliases } = bot;

    if (message.content.startsWith(config.Settings.Prefix)) {
        let msgArray = message.content.split(" "),
            command = msgArray[0].toLowerCase(),
            args = msgArray.slice(1),
            permissions = [];

        let commands =
            Commands.get(command.slice(config.Settings.Prefix.length)) ||
            Commands.get(
                Aliases.get(command.slice(config.Settings.Prefix.length))
            );
        if (commands && typeof commands.run == "function") {
            if (commands.commandData.Permission) {
                if (typeof commands.commandData.Permission == "string") {
                    commands.commandData.Permission = [commands.Permission];
                } else if (!commands.commandData.Permission[0]) {
                    commands.commandData.Permission[0] = "@everyone";
                }
                if (
                    commands.commandData.Permission.includes("@everyone") ||
                    commands.commandData.Permission.includes("everyone")
                ) {
                    permissions.push(true);
                } else {
                    for (const role of commands.commandData.Permission) {
                        if (Utils.hasRole(message.member, role, true)) {
                            permissions.push(true);
                        } else {
                            permissions.push(false);
                        }
                    }
                }
            }
            if (permissions.includes(true)) {
                commands.run(bot, message, args, config);
            } else {
                message.reply(
                    Utils.setupMessage({
                        configPath: lang.Presets.NoPermission,
                        variables: [
                            {
                                searchFor: /{roles}/g,
                                replaceWith:
                                    commands.commandData.Permission.map((x) => {
                                        let role = Utils.findRole(
                                            x,
                                            message.guild,
                                            true
                                        );
                                        if (role) return roleMention(role.id);
                                    }).join(", "),
                            },
                            ...Utils.userVariables(message.member),
                        ],
                    })
                );
            }
        }
    }
};
module.exports.once = false;
