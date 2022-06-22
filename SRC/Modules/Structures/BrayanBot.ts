import { Collection, Client, ClientOptions } from "discord.js";
import { CommandHandler } from "./Handlers/Commands";
import { EventHandler } from "./Handlers/Events";
import fs from "fs";
 
type ManagerOptions = {
    commandDir: string
    eventDir: string
}

type Handlers = {
    EventHandler?: EventHandler
    CommandHandler?: CommandHandler
}

export class BrayanBot extends Client {
    public managerOptions: ManagerOptions;
    commands: Collection<string, Object> = new Collection();
    events: { name: string, handler: Function }[] = [];
    handlers: Handlers = {};

    constructor(clientOptions: ClientOptions, managerOptions: ManagerOptions) {
        super(clientOptions);

        if (!managerOptions) throw new Error("[BrayanBot] No options was provided.");

        if (!managerOptions.commandDir) throw new Error("[BrayanBot] No command directory was provided.");
        if (!fs.existsSync(managerOptions.commandDir)) fs.mkdirSync(managerOptions.commandDir);

        if (!managerOptions.eventDir) throw new Error("[BrayanBot] No event directory was provided.");
        if (!fs.existsSync(managerOptions.eventDir)) fs.mkdirSync(managerOptions.eventDir);

        this.managerOptions = managerOptions;

        return this;
    }

    async initializeHandlers() {
        this.handlers.CommandHandler = await new CommandHandler(this, this.managerOptions.commandDir).initialize();
        this.handlers.EventHandler = await new EventHandler(this, this.managerOptions.eventDir).initialize();
    }
}