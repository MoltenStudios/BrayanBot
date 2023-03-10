import Discord from "discord.js";
const { Collection, Client, ClientOptions, REST } = Discord;
import { Command, CommandHandler } from "./Handlers/Commands.js";
import { Addon, AddonHandler } from "./Handlers/Addons.js";
import { CommandsType } from "../../Configs/commands.js";
import { DatabaseHandler } from "./Handlers/Database.js";
import { ConfigHandler } from "./Handlers/Config.js";
import { ConfigType } from "../../Configs/config.js";
import { EventHandler } from "./Handlers/Events.js";
import { LangType } from "../../Configs/lang.js";
import Utils from "../Utils.js";
import fs from "fs";

const Logger = {
    info: (...text) => { },
    debug: (...text) => { },
    warn: (...text) => { },
    error: (...text) => { },
}

const ManagerOptions = {
    commandDir: String,
    configDir: String,
    eventDir: String,
    addonDir: String,
    databaseDir: String,
}

const Handlers = {
    EventHandler: EventHandler,
    CommandHandler: CommandHandler,
    ConfigHandler: ConfigHandler,
    AddonHandler: AddonHandler,
    DatabaseHandler: DatabaseHandler,
}

const Configs = {
    commands: CommandsType,
    config: ConfigType,
    lang: LangType,
}


export class BrayanBot extends Client {
    /** @type {Collection<string, Command>} */ commands = new Collection();
    /** @type {Collection<string, Command>} */ aliases = new Collection();
    /** @type {Collection<string, Addon>} */ addons = new Collection();
    /** @type {Collection<string, RawSlashCommand>} */ slashCommands = new Collection();
    /** @type {{ name: string, handler: Function }[]} */ events = [];
    /** @type {ManagerOptions} */ managerOptions;
    /** @type {Handlers} */ handlers = {};
    /** @type {Configs} */ configs = {};
    /** @type {Logger} */ logger

    /**
     * @param {ClientOptions} clientOptions @param {ManagerOptions} managerOptions 
     */
    constructor(clientOptions, managerOptions) {
        super(clientOptions);

        if (!managerOptions) throw new Error("[BrayanBot] No options was provided.");

        if (!managerOptions.commandDir) throw new Error("[BrayanBot] No command directory was provided.");
        if (!fs.existsSync(managerOptions.commandDir)) fs.mkdirSync(managerOptions.commandDir);

        if (!managerOptions.configDir) throw new Error("[BrayanBot] No config directory was provided.");
        if (!fs.existsSync(managerOptions.configDir)) fs.mkdirSync(managerOptions.configDir);

        if (!managerOptions.eventDir) throw new Error("[BrayanBot] No event directory was provided.");
        if (!fs.existsSync(managerOptions.eventDir)) fs.mkdirSync(managerOptions.eventDir);

        if (!managerOptions.addonDir) throw new Error("[BrayanBot] No addon directory was provided.");
        if (!fs.existsSync(managerOptions.addonDir)) fs.mkdirSync(managerOptions.addonDir);

        if (!managerOptions.databaseDir) throw new Error("[BrayanBot] No database directory was provided.");
        if (!fs.existsSync(managerOptions.databaseDir)) fs.mkdirSync(managerOptions.databaseDir);

        this.managerOptions = managerOptions;
        this.logger = Utils.logger;

        return this;
    }

    async initializeHandlers() {
        this.handlers.ConfigHandler = await new ConfigHandler(this, this.managerOptions.configDir).initialize();
        this.handlers.EventHandler = await new EventHandler(this, this.managerOptions.eventDir).initialize();
        this.handlers.CommandHandler = await new CommandHandler(this, this.managerOptions.commandDir).initialize();
        this.handlers.DatabaseHandler = await new DatabaseHandler(this, this.managerOptions.databaseDir).initialize();
        this.handlers.AddonHandler = await new AddonHandler(this, this.managerOptions.addonDir).initialize();

        this.rest = new REST({ version: "10" }).setToken(this.configs.config.Settings.Token);

        return this;
    }
}

export { Configs, Handlers, ManagerOptions }