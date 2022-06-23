import { Collection, Client, ClientOptions } from "discord.js";
import { CommandHandler } from "./Handlers/Commands";
import { ConfigHandler } from "./Handlers/Config";
import { ConfigType } from "../../Configs/config";
import { EventHandler } from "./Handlers/Events";
import fs from "fs";
 
type ManagerOptions = {
    commandDir: string;
    configDir: string;
    eventDir: string;
}

type Handlers = {
    EventHandler?: EventHandler
    CommandHandler?: CommandHandler
    ConfigHandler?: ConfigHandler
}

type Configs = {
    commands?: {};
    config?: ConfigType;
    lang?: {};
}

export class BrayanBot extends Client {
    public commands: Collection<string, Object> = new Collection();
    public events: { name: string, handler: Function }[] = [];
    public managerOptions: ManagerOptions;
    public handlers: Handlers = {};
    public configs: Configs = {}

    constructor(clientOptions: ClientOptions, managerOptions: ManagerOptions) {
        super(clientOptions);

        if (!managerOptions) throw new Error("[BrayanBot] No options was provided.");

        if (!managerOptions.commandDir) throw new Error("[BrayanBot] No command directory was provided.");
        if (!fs.existsSync(managerOptions.commandDir)) fs.mkdirSync(managerOptions.commandDir);

        if (!managerOptions.configDir) throw new Error("[BrayanBot] No config directory was provided.");
        if (!fs.existsSync(managerOptions.configDir)) fs.mkdirSync(managerOptions.configDir);

        if (!managerOptions.eventDir) throw new Error("[BrayanBot] No event directory was provided.");
        if (!fs.existsSync(managerOptions.eventDir)) fs.mkdirSync(managerOptions.eventDir);

        this.managerOptions = managerOptions;

        return this;
    }

    async initializeHandlers() {
        this.handlers.CommandHandler = await new CommandHandler(this, this.managerOptions.commandDir).initialize();
        this.handlers.ConfigHandler = await new ConfigHandler(this, this.managerOptions.configDir).initialize();
        this.handlers.EventHandler = await new EventHandler(this, this.managerOptions.eventDir).initialize();
    }
}

export { Configs, Handlers, ManagerOptions }