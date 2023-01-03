import { BrayanBot } from "../BrayanBot.js";
import { manager } from "../../../index.js";
import { readdirSync } from "fs";
import path from "path";

export class EventHandler {
    /** @type {BrayanBot} */ manager;
    /** @type {string} */ eventDir;
    /** @type {string[]} */ eventFiles;

    /**
     * @param {BrayanBot} manager @param {string} eventDir 
     */
    constructor(manager, eventDir) {
        if (!manager) throw new Error("[BrayanBot/EventHandler] Missing manager parameter.");
        if (!eventDir) throw new Error("[BrayanBot/EventHandler] Missing eventDir parameter.");

        this.manager = manager;
        this.eventDir = eventDir;
        this.eventFiles = readdirSync(eventDir).filter(file => file.endsWith(".js"));

        return this;
    }

    async initialize() {
        for (let i = 0; i < this.eventFiles.length; i++) {
            // Import the event file as an ESM
            import(`file://` + path.join(this.eventDir, this.eventFiles[i])).then(() => {
                // The event file has been imported
            });
        }

        return this;
    }
}

export class EventListener {
    /** @type {string} */
    name;
    /** @type {(client: BrayanBot) => any} */
    handler;

    /**
     * @param {string} name @param {(client: BrayanBot, ...params: any) => { }} handler 
     */
    constructor(name, handler) {
        this.name = name;
        this.handler = handler;

        manager.events.push({ name, handler });
        manager.on(name, async (...params) => await handler(manager, ...params));
    }
}

export class EventEmitter {
    /**
     * @param {string} name @param  {...any} params 
     */
    constructor(name, ...params) {
        manager.emit(name, ...params);
    }
}