const Discord = require('discord.js'),
    Utils = require('../Modules/Utils')

module.exports = async (bot, interaction) => {
    const { config, lang, SlashCmds } = bot;
    let permissions = []
    // Slash Command Executing
    if (interaction.isCommand()) {
        const command = SlashCmds.find(x => x.slashData.name.toLowerCase() == interaction.commandName.toLowerCase());
        if (command) {
            if (command.commandData.Permission) {
                if (typeof command.commandData.Permission == 'string')
                    command.commandData.Permission = [command.Permission]

                if (!command.commandData.Permission[0])
                    command.commandData.Permission[0] = "@everyone"


                for (const role of command.commandData.Permission) {
                    if (Utils.hasRole(interaction.member, role, true)) {
                        permissions.push(true)
                    } else {
                        permissions.push(false)
                    }
                }
                if (permissions.includes(true)) {
                    command.runSlash(bot, interaction)
                } else {
                    interaction.reply({
                        ephemeral: true,
                        embeds: [
                            Utils.setupEmbed({
                                configPath: lang.Presets.NoPermission,
                                variables: [
                                    {
                                        searchFor: /{roles}/g, replaceWith: command.commandData.Permission.map(r => {
                                            let role = Utils.findRole(r, interaction.guild, true)
                                            if (role) return `<@&${role.id}>`
                                        }).join(", ")
                                    },
                                    ...Utils.userVariables(interaction.member)
                                ]
                            })
                        ]
                    })
                }
            }
        } else {
            let cmd = bot.guilds.cache.get(bot.config.GuildID).commands.cache.find(x => x.name.toLowerCase() == interaction.commandName.toLowerCase())
            if (cmd) cmd.delete()
            interaction.reply({ content: "This command no longer exists.", ephemeral: true })
        }
    } else if (interaction.isButton()) {
        bot.emit('interactionCreate-Button', interaction);
    } else if (interaction.isSelectMenu()) {
        bot.emit('interactionCreate-SelectMenu', interaction);
    }
}
module.exports.once = false