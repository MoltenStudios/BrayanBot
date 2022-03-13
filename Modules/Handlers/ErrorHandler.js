const { client, config, lang, commands } = require("../../index"),
    Utils = require("../Utils"), { inspect } = require("util"),
    fs = require("fs"), chalk = require("chalk"),
    path = require("path"), moment = require('moment');
module.exports = {
    init: () => {
        process.on('uncaughtException', module.exports.uncaughtException);
        process.on('unhandledRejection', module.exports.unhandledRejection);
    },
    uncaughtException: async (error, source) => {
        const lines = "-".repeat(error.stack.split("\n").map(m => m.length).sort((a, b) => b - a)[0]);
        if (process.argv.includes("--show-errors")) {
            Utils.logError(`${chalk.red(`[[ Occured at: ${moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')} ]]`)}\n${lines}\n${error.toString()}\n${lines}`)
        } else {
            Utils.logError(`An unexpected error occured, please contact BrayanBot Support team at ${chalk.blue(chalk.underline(`https://discord.gg/G4AV33KeqF`))}`)
        }

        let data = `${lines}\n[[ Occured at: ${moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')} ]]\n${lines}\n${error.toString()}${source ? `\nMore Info: ${source}` : ""}\n`
        fs.appendFileSync("errors.txt", data, { encoding: "utf-8" });

        Utils.logInfo("Stopping bot..");
        process.exit(0)
    },
    unhandledRejection: async (reason, promise = "") => {
        const promiseText = inspect(promise) || "", consoleIgnore = [
            "DiscordAPIError: Unknown Role",
            "DiscordAPIError: Unknown Member",
            "DiscordAPIError: Unknown Message",
            "DiscordAPIError: Unknown Channel"
        ];
        if (!consoleIgnore.includes(reason.toString())) {
            let lines;
            if (process.argv.includes("--show-errors")) {
                lines = lines = "-".repeat(reason.toString().length)
                Utils.logError(`${chalk.red(`[[ Occured at: ${moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')} ]]`)}\n${lines}\n${reason.toString()}\n${lines}`)
            } else {
                Utils.logError(`An unexpected error occured, please contact BrayanBot Support team at ${chalk.blue(chalk.underline(`https://discord.gg/G4AV33KeqF`))}`)
            }
            lines = "-".repeat((reason.stack || reason.toString()).split("\n").map(m => m.length).sort((a, b) => b - a)[0])
            let data = `${lines}\n[[ Occured at: ${moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')} ]]\n${lines}\n${reason.toString()}${promiseText ? `\nMore Info: ${promiseText}` : ""}\n`
            fs.appendFileSync("errors.txt", data, { encoding: "utf-8" });
        }
    }
};
