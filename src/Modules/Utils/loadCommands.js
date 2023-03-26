import { BrayanBot } from '../Structures/BrayanBot.js';
import { Routes } from 'discord.js';

/** @param {BrayanBot} manager */
const loadCommands = async (manager, force = false) => {
    const enabledCMDS = manager.commands.filter(cmd => Array.isArray(cmd.commandData.Arguments));

    const cmdsToRegister = force || process.argv.includes("--reset-slashCommands")
        ? manager.slashCommands.filter(cmd => !!enabledCMDS.find(c => c.commandData.Name == cmd.name))
        : manager.slashCommands;

    if (cmdsToRegister.toJSON().length > 0) {
        await manager.rest.put(Routes.applicationCommands(manager.user.id), { body: cmdsToRegister.toJSON() })
    }

    return cmdsToRegister;
}

export { loadCommands }