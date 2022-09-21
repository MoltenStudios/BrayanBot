import { CommandInteraction, GuildMember, Interaction, InteractionReplyOptions } from "discord.js";
import { BrayanBot } from "../Modules/Structures/BrayanBot";
import { EventListener } from "../Modules/Structures/Handlers/Events";
import Utils from "../Modules/Utils";

export default new EventListener("interactionCreate", async (bot: BrayanBot, interaction: Interaction) => {
    const { config, lang } = bot.configs;

    if(interaction.isChatInputCommand()) {
        const command = interaction.commandName;
        
        const cmd = bot.commands.get(command);
        if(cmd && cmd.commandData.Enabled == true) {
            if(cmd.commandData.Permission && !Utils.hasPermission(cmd.commandData.Permission, interaction.member as GuildMember)) {
                return interaction.reply(Utils.setupMessage({
                    configPath: lang?.Miscellaneous.InvalidPermissions!,
                    variables: Utils.userVariables(interaction.member as GuildMember)
                }) as InteractionReplyOptions)
            }
    
            await cmd.InteractionRun?.call(this, bot, interaction, [{}], cmd);
        }
    }
})