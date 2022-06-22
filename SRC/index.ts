import { BrayanBot } from "./Modules/Structures/BrayanBot";
import { Intents } from "discord.js";
import path from "path";

const manager: BrayanBot = new BrayanBot({
    intents: new Intents(32767),
    failIfNotExists: false,
    retryLimit: 5,
}, {
    commandDir: path.join(__dirname, "Commands"),
    eventDir: path.join(__dirname, "Events"),
});

(async () => {
    await manager.initializeHandlers();
})().then(() => {
    manager.login("my-bot-token-that-u-won't-have");
})

export { manager };