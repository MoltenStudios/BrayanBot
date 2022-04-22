const fs = require('fs'),
    chalk = require("chalk"),
    consoleIgnore = [
        "DiscordAPIError: Unknown Role",
        "DiscordAPIError: Unknown Member",
        "DiscordAPIError: Unknown Message",
        "DiscordAPIError: Unknown Channel"
    ],
    knownErrors = [
        "Error: ENOENT: no such file or directory, open 'config.yml'",
        "Error [TOKEN_INVALID]: An invalid token was provided."
    ]
let log = {
    errorStart: chalk.hex("#ff5e5e").bold("\n[ERROR START]"),
    errorEnd: chalk.hex("#ff5e5e").bold("\n[ERROR END]"),
    warn: chalk.hex("#ffa040").bold("[WARNING]"),
}
module.exports = (shortError, fullError = "") => {
    function sendMessage() {
        if (shortError.includes(`config.yml`)) return console.log(log.warn, `Couldn't find config.yml. Please follow our setup guide! https://brayanbot.dev/docs/setup/hosting/windows`)
        if (shortError.includes(`TOKEN_INVALID`)) return console.log(log.warn, `Your bot token is incorrect. Please update in config.yml`)

    }
    if (!shortError) return;
    if (typeof shortError !== "string") shortError = shortError.toString();
    if (!consoleIgnore.includes(shortError)) {
        if (process.argv.slice(2).includes("--show-errors")) console.log(`${log.errorStart} ${shortError}\n${fullError} ${log.errorEnd}`)
        else if (knownErrors.includes(shortError)) return sendMessage()
        else console.log(`${log.warn} ${shortError}`);
    }

    return;
}