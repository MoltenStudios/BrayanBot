import { EventListener } from "../Modules/Structures/Handlers/Events.js";
import { BryanBot } from "../Modules/Structures/BryanBot.js";
import fastFolderSize from "fast-folder-size/sync.js";
import Utils from "../Modules/Utils.js";
import chalk from "chalk";

/** @param {BryanBot} bot */
const execute = async (bot) => {
  const version = "2.0.0";
  const { debug, info, warn, error } = bot.logger;
  const guild = bot.guilds.cache.first();

  if (bot.configs.config?.Settings.UseMentionPrefix)
    if (
      Array.isArray(bot.configs.config?.Settings.Prefix) &&
      !bot.configs.config?.Settings.Prefix.includes(`<@${bot.user?.id}> `)
    )
      bot.configs.config?.Settings.Prefix.push(`<@${bot.user?.id}> `);

  if (!guild) {
    info(
      chalk.blue(
        `https://discord.com/api/oauth2/authorize?client_id=${bot.user?.id}&permissions=8&scope=bot%20applications.commands`
      )
    );
    return error(
      `${chalk.bold("BryanBot")} is in currently in ${chalk.bold(
        bot.guilds.cache.size
      )} servers. | ${chalk.bold("BryanBot")} requires atlest ${chalk.bold(
        1
      )} server.`,
      `Use the invite link above to invite ${chalk.bold(
        "BryanBot"
      )} into your server.`
    );
  }
  [
    chalk.whiteBright(
      `•«                                                          »•`
    ),
    chalk.whiteBright(`             BryanBot ${`v${version}`} is now online!`),
    chalk.whiteBright(`               Thanks for using BryanBot!`),
    chalk.whiteBright(``),
    chalk.whiteBright(`       Join our Discord Server if you face any issues.`),
    chalk.whiteBright(
      `               ${chalk.blueBright.underline(
        `https://neushore.dev/discord`
      )}`
    ),
    chalk.whiteBright(
      `•«                                                          »•`
    ),
  ].forEach((line) => info(line));

  await Utils.loadCommands(bot);

  debug(
    `Currently using ${chalk.bold(
      `${((fastFolderSize(".") || 0) / 1024 / 1024).toFixed(2)} MB`
    )} Storage.`
  );
  debug(`Loaded ${chalk.bold(bot.commands.size)} commands.`);
  debug(`Loaded ${chalk.bold(bot.events.length)} events.`);

  info(`Logged in as ${chalk.bold(bot.user?.tag || "Unknown")}`);
  info(
    `Everything has been loaded & ${chalk.bold(`BryanBot`)} is ready to use!`
  );
};

export default new EventListener("ready", execute);
