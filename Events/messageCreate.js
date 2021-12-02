const Discord = require("discord.js"),
    Utils = require('../Modules/Utils'),
    { roleMention } = require('@discordjs/builders');

module.exports = async (bot, message) => {
    const { config, Commands, lang, Aliases } = bot;

    if (message.content.startsWith(config.Settings.Prefix) && typeof command.run == "function") {
        let msgArray = message.content.split(" "),
            command = msgArray[0].toLowerCase(),
            args = msgArray.slice(1),
            hasPermission = false

        let commands = Commands.get(command.slice(config.Settings.Prefix.length))
            || Commands.get(Aliases.get(command.slice(config.Settings.Prefix.length)))
        if (commands) {
            if (commands.commandData.Permission) {
                if (typeof commands.commandData.Permission == 'string') {
                    commands.commandData.Permission = [commands.Permission]
                } else if (!commands.commandData.Permission[0]) {
                    commands.commandData.Permission[0] = "@everyone"
                }
                if (commands.commandData.Permission.includes("@everyone") || commands.commandData.Permission.includes("everyone")) {
                    hasPermission = true
                } else {
                    for (const role of commands.commandData.Permission) {
                        if (!Utils.hasRole(message.member, role, true)) {
                            if (!hasPermission == true) hasPermission = false
                        } else {
                            hasPermission = true
                        }
                    }
                }
            }
            if (hasPermission) {
                commands.run(bot, message, args, config)
            } else {
                message.reply({
                    embeds: [
                        Utils.setupEmbed({
                            configPath: lang.Presets.NoPermission,
                            variables: [
                                {
                                    searchFor: /{roles}/g, replaceWith: commands.commandData.Permission.map(x => {
                                        let role = Utils.findRole(x, message.guild, true)
                                        if (role) return roleMention(role.id)
                                    }).join(", ")
                                },
                                ...Utils.userVariables(message.member)
                            ]
                        })
                    ],
                    allowedMentions: {
                        repliedUser: false
                    }
                })
            }
        }
    }
}
module.exports.once = false