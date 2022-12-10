import { Collection, Client, ClientOptions, REST } from "discord.js";
import { Command, CommandHandler } from "./Handlers/Commands";
import { RawSlashCommand } from "../Utils/setupSlashCommand";
import { Addon, AddonHandler } from "./Handlers/Addons";
import { CommandsType } from "../../Configs/commands";
import { ConfigHandler } from "./Handlers/Config";
import { ConfigType } from "../../Configs/config";
import { EventHandler } from "./Handlers/Events";
import { LangType } from "../../Configs/lang";
import Utils from "../Utils";
import fs from "fs";
import { DatabaseHandler } from "./Handlers/Database";

type Logger = {
    info: (...text: any[]) => void;
    debug: (...text: any[]) => void;
    warn: (...text: any[]) => void;
    error: (...text: any[]) => void;
}

type ManagerOptions = {
    commandDir: string;
    configDir: string;
    eventDir: string;
    addonDir: string;
    databaseDir: string;
}

type Handlers = {
    EventHandler?: EventHandler
    CommandHandler?: CommandHandler
    ConfigHandler?: ConfigHandler
    AddonHandler?: AddonHandler
    DatabaseHandler?: DatabaseHandler
}

type Configs = {
    commands: CommandsType;
    config: ConfigType;
    lang: LangType;
}


export class BrayanBot extends Client {
    databaseDir(databaseDir: any, arg1: string): string | Buffer {
        throw new Error("Method not implemented.");
    }
    public commands: Collection<string, Command> = new Collection();
    public addons: Collection<string, Addon> = new Collection();
    public slashCommands: Collection<string, RawSlashCommand> = new Collection();
    public events: { name: string, handler: Function }[] = [];
    public managerOptions: ManagerOptions;
    public handlers: Handlers = {};
    // @ts-ignore
    public configs: Configs = {};
    public logger: Logger

    constructor(clientOptions: ClientOptions, managerOptions: ManagerOptions) {
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
        this.handlers.AddonHandler = await new AddonHandler(this, this.managerOptions.addonDir).initialize();
        this.handlers.DatabaseHandler = await new DatabaseHandler(this, this.managerOptions.databaseDir).initialize();

        this.rest = new REST({ version: "10" }).setToken(this.configs.config.Settings.Token);

        return this;
    }
}

export { Configs, Handlers, ManagerOptions }