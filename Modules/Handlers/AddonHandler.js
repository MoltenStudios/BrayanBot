const e = require("express");
const fs = require("fs"), YAML = require("yaml"),
    chalk = require("chalk"), Utils = require("../Utils"),
    { client, config, lang, commands } = require("../../index");

module.exports = {
    getConfig: (name, config, extension = "yml") => {
        if (fs.existsSync("./Addon_Configs") && fs.existsSync(`./Addon_Configs/${name}/${config}.${extension}`)) {
            return YAML.parse(fs.readFileSync(`./Addon_Configs/${name}/${config}.${extension}`, "utf-8"));
        } else {
            return false;
        }
    },
    getConfigs: (name, extension = "yml") => {
        let configs = {}

        if (fs.existsSync("./Addon_Configs") && fs.existsSync(`./Addon_Configs/${name}/`)) {
            let allFiles = fs.readdirSync(`./Addon_Configs/${name}/`)
            let filtredFiles = allFiles.filter((f) => f.split(".").pop() == extension)
            if (filtredFiles && filtredFiles[0]) {
                filtredFiles.forEach(x => {
                    if (fs.readFileSync(`./Addon_Configs/${name}/${x}`, { encoding: "utf-8" }))
                        configs[x.replace(`.${extension}`, "").toLowerCase()] =
                            YAML.parse(fs.readFileSync(`./Addon_Configs/${name}/${x}`, "utf-8"))
                })
            }
        }
        return configs;
    },
    /**
     * 
     * @param {String} addonName 
     * @param {Array} dependencies 
     * @returns 
     */
    installModules: async (addonName, dependencies) => new Promise(async (resolve, reject) => {
        if (!dependencies || !Array.isArray(dependencies) || !dependencies[0]) return resolve(true);

        if(process.argv.includes("--skip-dependencies")) return resolve(true);

        let showOutput = process.argv.includes("--show-install-output"),
            { spawn } = require("child_process"), modulesToInstall = [],
            dependenciesInstalled = [];

        for (let index = 0; index < dependencies.length; index++) {
            try {
                require.resolve(dependencies[index])
                dependenciesInstaled.push(dependencies[index]);
            } catch (e) {
                modulesToInstall.push(dependencies[index]);
            }
        }
        dependenciesInstalled.forEach(x => dependencies = dependencies.filter(y => y != x));
        if (!dependencies[0]) return resolve(true);

        if (process.argv.includes("--no-install")) return resolve("no-install but dependencies");
        Utils.logInfo(`Installing ${chalk.bold(dependencies.length)} node modules for ${chalk.bold(addonName)} addon`);

        let data = await spawn(process.platform == "win32" ? "npm.cmd" : "npm", ["install", ...dependencies]);
        data.stdout.on("data", (data) => {
            showOutput ? Utils.logInfo(data.toString().trim()) : "";
        })
        data.stderr.on("data", (data) => {
            showOutput ? Utils.logError(data.toString().trim()) : ""
        })
        data.on("exit", (code) => {
            Utils.logInfo(`Installed ${chalk.bold(dependencies.length)} node modules for ${chalk.bold(addonName)} addon. Please restart the bot.`);
            process.exit(0);
        })
    }),
    init: () => new Promise(async (resolve, reject) => {
        if (!fs.existsSync("Addons")) fs.mkdirSync("Addons");
        if (!fs.existsSync("Addon_Configs")) await fs.mkdirSync("Addon_Configs");

        let files = fs.readdirSync("Addons").filter(x => x.split(".").pop() == "js");
        let priority = { 0: [], 1: [], 2: [], 3: [] };

        files.forEach(file => {
            let addon = require(`../../Addons/${file}`);
            let _priority = addon.priority || addon._priority || 3;

            if (_priority == 1) priority[0].push(file);
            else if (_priority == 2) priority[1].push(file);
            else if (_priority == 3) priority[2].push(file);
            else priority[3].push(file);
        })

        for (let i = 0; i <= 5; i++) {
            if (priority[i]) for (let index = 0; index < priority[i].length; index++) {
                const addon = require(`../../Addons/${priority[i][index]}`);
                if (!addon) continue;

                let Name = addon.name || addon._name;
                if (!Name) continue;

                let Log = addon.log || addon._log;
                let Author = addon.author || addon._author;
                let Version = addon.version || addon._version;
                let CustomConfig = addon.customConfigs || addon._customConfigs || {};
                let Dependencies = addon.dependencies || addon._dependencies;

                if (!fs.existsSync(`Addon_Configs/${Name}`)) fs.mkdirSync(`Addon_Configs/${Name}`);

                await Utils.createMultipleConfigs(CustomConfig, Name).then(async (addonConfigs) => {
                    await module.exports.installModules(Name, Dependencies).then(async (installed) => {
                        if (installed == true) {
                            let addonFunction = typeof addon == "function" ? addon
                                : typeof addon.run == "function"
                                    ? addon.run : false;

                            if (typeof addonFunction == "function") {
                                await addonFunction(client, addonConfigs);

                                if (Log) {
                                    if (typeof Log == "string" && Log.startsWith("_nonInfo")) {
                                        console.log(Log.replace(/_nonInfo/g, ""));
                                    } else if (typeof Log == "string") {
                                        Utils.logInfo(Log);
                                    } else if (typeof Log == "boolean" && Log && Author && typeof Author == "object") {
                                        if (typeof Author == "string") {
                                            console.log(chalk.hex("#007bff").bold(`[${Author}] `) + Log);
                                        } else if (typeof Author == "object" && typeof Author.name == "string") {
                                            console.log(chalk.hex(Author.color || "#007bff").bold(`[${Author.name}] `) + `${chalk.bold(Name)} addon has been loaded. ${Version ? " Version: " + chalk.bold(Version) : ""}`);
                                        } else {
                                            Utils.logInfo(`${chalk.bold(Name)} addon has been loaded. ${Version ? " Version: " + chalk.bold(Version) : ""}`);
                                        }
                                    } else if (typeof Log == "function") {
                                        await Log();
                                    } else {
                                        Utils.logInfo(`${chalk.bold(Name)} addon has been loaded. ${Version ? " Version: " + chalk.bold(Version) : ""}`);
                                    }
                                }
                            } else {
                                Utils.logError(`[AddonHandler] Unable to execute addon ${chalk.bold(Name)} as no function was found.`);
                            }
                        } else if (installed == "no-install but dependencies") {
                            Utils.logError(`[AddonHandler] ${chalk.bold(Name)} addon requires ${chalk.bold(Dependencies.length)} node modules to be installed. Please restart the bot without the ${chalk.bold("--no-install")} flag.`);
                        }
                    })
                })
            }

            if (priority[i] == 4) resolve();
        }

        resolve()
    })
};
