import { readdirSync, lstatSync } from "fs";
import { BrayanBot } from "../BrayanBot.js";
import { Config } from "./Config.js";
import Utils from "../../Utils.js";
import chalk from "chalk";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

export class AddonHandler {
    /** @type {BrayanBot} */ manager;
    /** @type {string} */ addonDir;
    /** @type {string[]} */ addonDirFiles;

    /** @param {BrayanBot} manager @param {string} addonDir */
    constructor(manager, addonDir) {
        if (!manager) throw new Error("[BrayanBot/AddonHandler] Missing manager parameter.");
        if (!addonDir) throw new Error("[BrayanBot/AddonHandler] Missing addonDir parameter.");

        this.manager = manager;
        this.addonDir = addonDir;
        this.addonDirFiles = readdirSync(addonDir).filter(x => x.endsWith(".js"));

        return this;
    }

    /** @param {string[]} dirFiles */
    async initialize(dirFiles) {
        for (let i = 0; i < (dirFiles ? dirFiles : this.addonDirFiles).length; i++) {
            const isDir = lstatSync(path.join(this.addonDir, this.addonDirFiles[i])).isDirectory();

            if (isDir) {
                const dirFiles = readdirSync(path.join(this.addonDir, this.addonDirFiles[i])).filter(x => x.endsWith(".js"));
                await this.initialize(dirFiles);
            } else {
                const { default: addon } = await import(`file://` + path.join(this.addonDir, this.addonDirFiles[i]))

                try {
                    await addon.execute(this.manager);
                    if (addon.log) console.log(chalk.yellowBright.bold("[ADDON]"), ...addon.log);
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
    /** @type {string} */ name;
    /** @type {string} */ version;
    /** @type {(manager: BrayanBot) => any} */ execute = () => { };
    /** @type {Array<string> | undefined} */ log;
    /** @type {Object | undefined} */ addonConfigs;

    /** @param {string} name @param {string} version */
    constructor(name, version) {
        this.name = name;
        this.version = version;

        return this;
    }
    /** @param {(manager: BrayanBot) => any} execute */
    setExecute(execute) { this.execute = execute; return this };
    /** @param  {...string} text */
    setLog(...text) { this.log = text; return this };

    /** @param {Object} configs */
    customConfig(configs) {
        this.addonConfigs = configs;

        const configKeys = Object.keys(configs);
        if (!fs.existsSync("./data/addon_configs")) fs.mkdirSync("./data/addon_configs");

        const returnConfigValue = {};
        for (let i = 0; i < configKeys.length; i++) {
            if (!fs.existsSync(`./data/addon_configs/${this.name}`)) fs.mkdirSync(`./data/addon_configs/${this.name}`);
            const config = new Config(path.join(__dirname, `./data/addon_configs/${this.name}/${configKeys[i]}.yml`), configs[configKeys[i]]);

            if (process.argv.includes("--reset-configs")) {
                returnConfigValue[configKeys[i]] = config.createFile().getFile();
            } else returnConfigValue[configKeys[i]] = config.getFile();
        }

        return returnConfigValue;
    }
}