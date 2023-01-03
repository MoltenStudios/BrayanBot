import { Routes } from 'discord.js';
import Utils from '../Utils.js';
import chalk from 'chalk';

const loadCommands = async (manager, force = false) => {
    const enabledCMDS = manager.commands.filter(cmd => cmd.commandData.SlashCommand.Enabled);

    const cmdsToRegister = force || process.argv.includes("--reset-slashCommands")
        ? manager.slashCommands.filter(cmd => !!enabledCMDS.find(c => c.commandData.Name == cmd.name))
        : manager.slashCommands;

    if (process.argv.includes("--reset-slashCommands")) {
        manager.guilds.cache.forEach(guild => guild?.commands.set([]).then(() =>
            guild.commands.cache.size !== 0 ? Utils.logger.debug(`All Slash Commands for guild ${chalk.bold(guild.name)} have been cleared!`) : null))

        manager.application?.commands.cache.size !== 0 ? manager.application?.commands.set([]).then(() =>
            Utils.logger.debug("All Global Slash Commands have been cleared!")) : null
    }

    if (cmdsToRegister.size !== 0) {
        manager.guilds.cache.forEach(guild => manager.rest.put(Routes.applicationGuildCommands(manager.user?.id, guild.id), { body: cmdsToRegister.toJSON() }).then(() => {
            Utils.logger.info(`${chalk.bold(cmdsToRegister.size)} Slash Commands for guild ${chalk.bold(guild.name)} have been registered!`)
        }))
    }

    return cmdsToRegister;
}

export { loadCommands }