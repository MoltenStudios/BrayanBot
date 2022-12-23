import { readdirSync, lstatSync } from "fs";
import { BrayanBot } from "../BrayanBot";
import { manager } from "../../../index";
import { Config } from "./Config";
import Discord from "discord.js";
import Utils from "../../Utils";
import chalk from "chalk";
import path from "path";
import fs from "fs";

export class AddonHandler {
    public manager: BrayanBot;
    public addonDir: string;
    public addonDirFiles: string[];

    constructor(manager: BrayanBot, addonDir: string) {
        if(!manager) throw new Error("[BrayanBot/CommandHandler] Missing manager parameter.");
        if(!addonDir) throw new Error("[BrayanBot/AddonHandler] Missing addonDir parameter.");

        this.manager = manager;
        this.addonDir = addonDir;
        this.addonDirFiles = readdirSync(addonDir).filter(x => x.endsWith(".js"));

        return this;
    }

    async initialize(dirFiles?: string[]) {
        for (let i = 0; i < (dirFiles ? dirFiles : this.addonDirFiles).length; i++) {
            const isDir = lstatSync(path.join(this.addonDir, this.addonDirFiles[i])).isDirectory();

            if(isDir) {
                const dirFiles = readdirSync(path.join(this.addonDir, this.addonDirFiles[i])).filter(x => x.endsWith(".js"));
                await this.initialize(dirFiles);
            } else {
                const addon: Addon = require(path.join(this.addonDir, this.addonDirFiles[i])).default;
                
                try {
                    await addon.execute(this.manager);
                    if(addon.log) console.log(chalk.yellowBright.bold("[ADDON]"), ...addon.log);
                } catch (e) {
                    Utils.logger.error(`An error has occurred executing '${addon.name}' addon!`);
                    Utils.logger.error(e);
                }

                this.manager.addons.set(addon.name, addon);
            }
        }
        
        return this;
    }
}

export class Addon {
    name: string;
    version: string;
    execute: (manager: BrayanBot) => any = () => {};
    log: Array<string> | undefined;
    private addonConfigs: Object | undefined;

    constructor(name: string, version: string) {
        this.name = name;
        this.version = version;

        return this;
    }
    setExecute(execute: (manager: BrayanBot) => any) { this.execute = execute; return this };
    setLog(...text: Array<string>) { this.log = text; return this };

    customConfig(configs: Object) {
        this.addonConfigs = configs;

        const configKeys = Object.keys(configs);
        if (!fs.existsSync("./data/Addon Configs")) fs.mkdirSync("./data/Addon Configs");

        const returnConfigValue = {};
        for (let i = 0; i < configKeys.length; i++) {
            if (!fs.existsSync(`./data/Addon Configs/${this.name}`)) fs.mkdirSync(`./data/Addon Configs/${this.name}`);
            /** @ts-ignore */
            const config = new Config(path.join(__dirname, `../../../../data/Addon Configs/${this.name}/${configKeys[i]}.yml`), configs[configKeys[i]], manager.configs.config.Settings.DevMode);

            /** @ts-ignore */
            returnConfigValue[configKeys[i]] = config.getFile();
        }

        return returnConfigValue;
    }
}