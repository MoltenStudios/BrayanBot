import { BrayanBot } from "../BrayanBot";
import { manager } from "../../../index";
import { Client } from "discord.js";
import { readdirSync } from "fs";
import path from "path";

export class EventHandler {
    public manager: BrayanBot;
    public eventDir: string;
    public eventFiles: string[];

    constructor(manager: BrayanBot, eventDir: string) {
        if(!manager) throw new Error("[BrayanBot/EventHandler] Missing manager parameter.");
        if(!eventDir) throw new Error("[BrayanBot/EventHandler] Missing eventDir parameter.");

        this.manager = manager;
        this.eventDir = eventDir;
        this.eventFiles = readdirSync(eventDir).filter(file => file.endsWith(".js"));

        return this;
    }

    async initialize() {
        for (let i = 0; i < this.eventFiles.length; i++) {
            const event = require(path.join(this.eventDir, this.eventFiles[i]));
        }

        return this;
    }
}

export class EventListener {
    public name: string;
    public handler: (client: Client) => any;
    
    constructor(name: string, handler = (client: Client) => {}) {
        this.name = name;
        this.handler = handler;
        manager.events.push({ name, handler });
        manager.on(name, async (...params) => {
            handler(manager, ...(params as []));
        });
    }
}

export class EventEmitter {
    constructor(name: string, ...params: []) {
        manager.emit(name, ...params);
    }
}