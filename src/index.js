import { BrayanBot } from "./Modules/Structures/BrayanBot.js";
import { GatewayIntentBits } from "discord.js";
import consoleStamp from "console-stamp";
import chalk from "chalk";
import path from "path";
import 'dotenv/config'

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

manager.login(process.env.TOKEN).catch((e) => {
    if (e.name.includes("TOKEN_INVALID")) {
    if (process.env.BOT_PLATFORM == "Docker") {
    // If this is a Dockerized environment, warn about the token environment variable and not a config.yml file.
        manager.logger.error(`Your current bot token is incorrect. Please set ENV_TOKEN in your compose file, or the env file.`), process.exit(1);
        } else manager.logger.error(`Your current bot token is incorrect. Please reset your token and replace it in config.`), process.exit(1);
    } else manager.logger.error(e), process.exit(1);
})

// manager.initializeHandlers().then((manager) => {
//     const { config } = manager.configs;
//     // If ENV_TOKEN is set, use it instead of config.yml
//     const token = process.env.ENV_TOKEN || config.Settings.Token;

//     if (token == "Your-Bot-Token") {
//         manager.logger.info(`Generated config.yml at ${chalk.bold("data/config.yml")}. Please configure this file and start bot again.`), process.exit(1);
//     } else manager.login(token).catch((e) => {
//         if (e.name.includes("TOKEN_INVALID")) {
//             if (process.env.BOT_PLATFORM == "Docker") {
//                 // If this is a Dockerized environment, warn about the token environment variable and not a config.yml file.
//                 manager.logger.error(`Your current bot token is incorrect. Please set ENV_TOKEN in your compose file, or the env file.`), process.exit(1);
//             } else manager.logger.error(`Your current bot token is incorrect. Please reset your token and replace it in config.`), process.exit(1);
//         } else manager.logger.error(e), process.exit(1);
//     });
// })

export { manager };