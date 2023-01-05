import { BrayanBot } from "./Modules/Structures/BrayanBot.js";
import { GatewayIntentBits } from "discord.js";
import consoleStamp from "console-stamp";
import chalk from "chalk";
import path from "path";

consoleStamp(console, { format: ":date(HH:MM:ss).bold.grey" })

const __dirname = path.resolve();
const manager = new BrayanBot({
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
    commandDir: path.join(__dirname, "/src/Commands"),
    configDir: path.join(__dirname, "/src/Configs"),
    eventDir: path.join(__dirname, "/src/Events"),
    addonDir: path.join(__dirname, "/data/addons"),
    databaseDir: path.join(__dirname, "/data/database")
});

manager.initializeHandlers().then((manager) => {
    const { config } = manager.configs;
    if (config.Settings.Token == "Your-Bot-Token") {
        manager.logger.info(`Generated config.yml at ${chalk.bold("data/config.yml")} please configure this file and start bot again.`), process.exit(1);
    } else manager.login(config.Settings.Token).catch((e) => {
        if (e.name.includes("TOKEN_INVALID")) {
            manager.logger.error(`Your current bot token is incorrect please reset your token and replace it in config.`), process.exit(1);
        } else manager.logger.error(e), process.exit(1);
    });
})

export { manager };