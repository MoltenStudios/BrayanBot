import { BrayanBot, Configs } from "../BrayanBot";
import path from "path";
import yaml from "yaml";
import fs from "fs";

export class ConfigHandler {
    public manager: BrayanBot;
    public configDir: string;
    public configFiles: string[];

    constructor(manager: BrayanBot, configDir: string) {
        if(!manager) throw new Error("[BrayanBot/ConfigHandler] Missing manager parameter.");
        if(!configDir) throw new Error("[BrayanBot/ConfigHandler] Missing configDir parameter.");

        this.manager = manager;
        this.configDir = configDir;
        this.configFiles = fs.readdirSync(configDir).filter(file => file.endsWith(".js"));

        return this;
    }

    async initialize() {
        if(!fs.existsSync("data/")) fs.mkdirSync("data/")
        for (let i = 0; i < this.configFiles.length; i++) {
            const configFile = require(path.join(this.configDir, this.configFiles[i]));
            const config: Config = configFile.default;
            config.configName = this.configFiles[i].replace(".js", "")

            if(process.argv.includes("--reset-configs"))
                this.manager.configs[config.configName as keyof Configs] = config.createFile().getFile();
            else this.manager.configs[config.configName as keyof Configs] = config.getFile();
        }

        return this;
    }
}

export class Config {
    private storagePath: string;
    private configData: any;
    public configName: string | undefined;

    constructor(storagePath: string, configData: any) {
        if (!storagePath) throw new Error("[BrayanBot/ConfigHandler] storagePath manager parameter.");
        if (!configData) throw new Error("[BrayanBot/ConfigHandler] configData manager parameter.");

        this.storagePath = storagePath;
        this.configData = configData;
        
        if(!this.fileExists()) {
            this.createFile();
        }

        return this;
    }

    getFile() {
        return yaml.parse(
            fs.readFileSync(this.storagePath, { encoding: "utf-8" }),
            { prettyErrors: true }
        )
    }

    createFile() {
        fs.writeFileSync(this.storagePath, this.formatFile(), { encoding: "utf-8" });
        return this;
    }

    fileExists() {
        return fs.existsSync(this.storagePath);
    }

    private formatFile() {
        return yaml.stringify(this.configData, { 
            indent: 2, 
            prettyErrors: true 
        })
        .replace(/("|')?~(\d+)?("|')?:\s("|')?.+("|')?/g, match => "# " + match.replace(/("|')?~(\d+)?("|')?:\s/g, '')
            .replace(/("|')/g, '')).replace(/("|')?~(c(\d+|))?("|')?:\s("|')?.+(\n {2}.+|)("|')?/g, match => {
            var comment = match.replace(/("|')?~(c(\d+|))?("|')?:\s/g, '');
            return (match.includes("#") ? "" : "#") + comment.substring(comment.startsWith("\"") || comment.startsWith("'") ? 1 : 0, comment.endsWith("\"") || comment.endsWith("'") ? comment.length - 1 : undefined).replace(/.+\n\s+/g, m => m.replace(/\n\s+/g, " ").replace(/\\"/g, "\""));
        }) // ~c(number) - multi line comments
        .replace(/("|')?~(l(\d+|))?("|')?:\s("|')?.+("|')?/g, "") // ~l(number) - empty line
    }
}