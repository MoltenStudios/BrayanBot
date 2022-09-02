import { BrayanBot } from "./Modules/Structures/BrayanBot";
import consoleStamp from "console-stamp";
import { GatewayIntentBits } from "discord.js";
import chalk from "chalk";
import path from "path";

consoleStamp(console, { format: ":date(HH:MM:ss).bold.grey" })

const manager: BrayanBot = new BrayanBot({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents
    ],
    failIfNotExists: false,
}, {
    commandDir: path.join(__dirname, "Commands"),
    configDir: path.join(__dirname, "Configs"),
    eventDir: path.join(__dirname, "Events"),
});

manager.initializeHandlers().then((manager) => {
    const { config, lang, commands } = manager.configs;
    if(config?.Settings) {
        if(config.Settings.Token == "Your-Bot-Token") {
            return manager.logger.info(`Generated config.yml at ${chalk.bold("data/config.yml")} please configure this file and start bot again.`), process.exit(1);
        } else manager.login(config.Settings.Token).catch((e: Error) => {
            if(e.name.includes("TOKEN_INVALID")) {
                return manager.logger.error(`Your current bot token is incorrect please reset your token and replace it in config.`), process.exit(1);
            } else return manager.logger.error(e), process.exit(1);
        });
    }
})

export { manager };