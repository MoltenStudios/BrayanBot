const Discord = require('discord.js'),
    Utils = require('../Modules/Utils')

module.exports = async (bot, interaction) => {
    const { config, lang, SlashCmds } = bot; 
    let permissions = []
    if(interaction.isCommand()) {
        const command = SlashCmds.find(x => x.name.toLowerCase() == interaction.commandName.toLowerCase());
        if(!command) {
            let cmd = bot.guilds.cache.get(bot.config.GuildID).commands.cache.find(x => x.name.toLowerCase() == interaction.commandName.toLowerCase())
            if(cmd) cmd.delete()
            return interaction.reply({ content: "This command no longer exists.", ephemeral: true })
        }
        if(command.commandData.Permission) {
            if(typeof command.commandData.Permission == 'string') 
                command.commandData.Permission = [command.Permission]

            if(!command.commandData.Permission[0])
                command.commandData.Permission[0] = "@everyone"
            

            for (const role of command.commandData.Permission) {
                if (!Utils.hasRole(interaction.member, role, true)) {
                    permissions.push(false)
                } else {
                    permissions.push(true)
                }
            }
        }

        if(permissions.includes(true)) {
            command.runSlash(bot, interaction)
        } else {
            interaction.reply({ 
                ephemeral: true,
                embeds: [
                    Utils.setupEmbed({
                        configPath: lang.Presets.NoPermission,
                        variables: [
                            { searchFor: /{roles}/g, replaceWith: command.commandData.Permission.map(r => {
                                let role = Utils.findRole(r, interaction.guild, true)
                                if(role) return `<@&${role.id}>` }).join(", ")},
                            ...Utils.userVariables(interaction.member)
                        ]
                    })
                ]
            })}

    } else if(interaction.isButton()) {}
    else if(interaction.isSelectMenu()) {}
}
module.exports.once = false