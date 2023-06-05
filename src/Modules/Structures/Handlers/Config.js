import { Proxima } from "../Proxima.js";
import { manager } from "../../../index.js"
import { createRequire } from "module";
import path from "path";
import yaml from "yaml";
import fs from "fs";

export class ConfigHandler {
    /** @type {Proxima} */ manager;
    /** @type {string} */ configDir;
    /** @type {string[]} */ configFiles;

    /** @param {Proxima} manager @param {string} configDir */
    constructor(manager, configDir) {
        if (!manager) throw new Error("[NeuShore/ConfigHandler] Missing manager parameter.");
        if (!configDir) throw new Error("[NeuShore/ConfigHandler] Missing configDir parameter.");

        this.manager = manager;
        this.configDir = configDir;
        this.configFiles = fs.readdirSync(configDir).filter(file => file.endsWith(".js"));

        return this;
    }

    async initialize() {
        if (!fs.existsSync("data/")) fs.mkdirSync("data/")
        for (let i = 0; i < this.configFiles.length; i++) {
            const { default: config } = await import(`file://` + path.join(this.configDir, this.configFiles[i]));

            config.configName = this.configFiles[i].replace(".js", "")
            if (process.argv.includes("--reset-configs")) {
                if (config.configName == "config") config.configData.Settings = {
                    ...config.configData.Settings, // To get settings not in config already
                    ...config.getFile().Settings // To overwrite settings from old config
                    // This system doesn't remove anything from config.Settings part.
                }

                manager.configs[config.configName] = config.createFile().getFile();
            } else manager.configs[config.configName] = config.getFile();
        }

        return this;
    }
}

export class Config {
    /** @type {string} */ storagePath;
    /** @type {any} */ configData;
    /** @type {string | undefined} */ configName;

    /** @param {string} storagePath @param {Object | Array} configData */
    constructor(storagePath, configData) {
        if (!storagePath) throw new Error("[NeuShore/ConfigHandler] storagePath manager parameter.");
        if (!configData) throw new Error("[NeuShore/ConfigHandler] configData manager parameter.");

        this.storagePath = storagePath;
        this.configData = configData;

        if (!this.fileExists()) {
            this.createFile();
        }

        return this;
    }

    getFile() {
        return yaml.parse(fs.readFileSync(this.storagePath, { encoding: "utf-8" }), { prettyErrors: true })
    }

    createFile() {
        if (!fs.existsSync("data/")) fs.mkdirSync("data/")
        fs.writeFileSync(this.storagePath, this.formatFile(), { encoding: "utf-8", flag: "w" });
        return this;
    }

    fileExists() {
        return fs.existsSync(this.storagePath);
    }

    formatFile() {
        return yaml.stringify(this.configData, {
            indent: 2,
            prettyErrors: true
        }).replace(/("|')?~(\d+)?("|')?:\s("|')?.+("|')?/g, match => "# " + match.replace(/("|')?~(\d+)?("|')?:\s/g, '')
            .replace(/("|')/g, '')).replace(/("|')?~(c(\d+|))?("|')?:\s("|')?.+(\n {2}.+|)("|')?/g, match => {
                var comment = match.replace(/("|')?~(c(\d+|))?("|')?:\s/g, '');
                return (match.includes("#") ? "" : "#") + comment.substring(comment.startsWith("\"") || comment.startsWith("'") ? 1 : 0, comment.endsWith("\"") || comment.endsWith("'") ? comment.length - 1 : undefined).replace(/.+\n\s+/g, m => m.replace(/\n\s+/g, " ").replace(/\\"/g, "\""));
            }) // ~c(number) - multi line comments
            .replace(/("|')?~(l(\d+|))?("|')?:\s("|')?.+("|')?/g, "") // ~l(number) - empty line
    }
}