import { BrayanBot } from "./Modules/Structures/BrayanBot.js";
import { GatewayIntentBits } from "discord.js";
import consoleStamp from "console-stamp";
import Utils from "./Modules/Utils.js";
import chalk from "chalk";
import path from "path";
import fs from "fs";

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
    backupDir: path.join(__dirname, "/backups"),
    addonDir: path.join(__dirname, "/data/addons"),
    databaseDir: path.join(__dirname, "/data/database"),
});

manager.initializeHandlers().then((manager) => {
    const { config } = manager.configs;
    // If ENV_TOKEN is set, use it instead of config.yml
    const token = process.env.ENV_TOKEN || config.Settings.Token;

    if (token == "Your-Bot-Token") {
        manager.logger.info(`Generated config.yml at ${chalk.bold("data/config.yml")}. Please configure this file and start bot again.`), process.exit(1);
    } else manager.login(token).catch((e) => {
        if (e.name.includes("TOKEN_INVALID")) {
            if (process.env.BOT_PLATFORM == "Docker") {
                // If this is a Dockerized environment, warn about the token environment variable and not a config.yml file.
                manager.logger.error(`Your current bot token is incorrect. Please set ENV_TOKEN in your compose file, or the env file.`), process.exit(1);
            } else manager.logger.error(`Your current bot token is incorrect. Please reset your token and replace it in config.`), process.exit(1);
        } else manager.logger.error(e), process.exit(1);
    });
    if (fs.existsSync("data/errors.log")) fs.unlinkSync("data/errors.log");


})

const errorLogStream = fs.createWriteStream("data/errors.log", { flags: "a" });

process.on("uncaughtException", (error, origin) => {
    const errorMessage = `${chalk.whiteBright.bold(error.message)}\n${error.stack.split('\n').slice(1, 5).join('\n')}`;
    errorLogStream.write(`${formatErrorMessage(error, 'uncaughtException')}\n`);

    if (process.argv.includes("--show-errors")) Utils.logger.error(errorMessage);
});


process.on("unhandledRejection", async (reason, promise) => {
    const errorMessage = `${chalk.whiteBright.bold(reason.message)}\n${reason.stack.split('\n').slice(1, 5).join('\n')}`;
    errorLogStream.write(`${formatErrorMessage(reason, 'unhandledRejection')}\n`);

    if (process.argv.includes("--show-errors")) Utils.logger.error(errorMessage);
});

const formatErrorMessage = (error, origin) => {
    const date = new Date().toISOString();
    const originInfo = origin ? `| ${origin}` : "";
    const errorInfo = error instanceof Error ? error.stack.split('\n').slice(0, 5).join('\n') : error;

    const separatorLength = Math.min(process.stdout.columns || 80, 100);
    const separator = "=-=".repeat(separatorLength / 3);

    return `${separator}\nOccured At: ${date} ${originInfo}\n${separator}\n${errorInfo}`;
}

export { manager };