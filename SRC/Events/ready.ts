import { BrayanBot } from "../Modules/Structures/BrayanBot";
import { EventListener } from "../Modules/Structures/Handlers/Events";
import chalk from "chalk";


export default new EventListener("ready", (bot: BrayanBot) => {
    const { debug, info, warn, error } = bot.logger;
    const guild = bot.guilds.cache.first();

    if(!guild) {
        info(chalk.blue(`https://discord.com/api/oauth2/authorize?client_id=${bot.user?.id}&permissions=8&scope=bot%20applications.commands`))
        return error(`${chalk.bold("BrayanBot")} is in currently in ${chalk.bold(bot.guilds.cache.size)} servers. | ${chalk.bold("BrayanBot")} requires atlest ${chalk.bold(1)} server.`, 
            `Use the invite link above to invite ${chalk.bold("BrayanBot")} into your server.`);
    }
    console.log("holding");
});