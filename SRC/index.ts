import { BrayanBot } from "./Modules/Structures/BrayanBot";
import { Intents } from "discord.js";
import path from "path";

const manager: BrayanBot = new BrayanBot({
    intents: new Intents(32767),
    failIfNotExists: false,
    retryLimit: 5,
}, {
    commandDir: path.join(__dirname, "Commands"),
    configDir: path.join(__dirname, "Configs"),
    eventDir: path.join(__dirname, "Events"),
});

(async () => {
    await manager.initializeHandlers();
})().then(() => {
    if(manager.configs.config?.Settings) {
        manager.login(manager.configs.config?.Settings.Token);
    }
})

export { manager };