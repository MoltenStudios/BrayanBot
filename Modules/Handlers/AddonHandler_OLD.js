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
            let filteredFiles = allFiles.filter((f) => f.split(".").pop() == extension)
            if (filteredFiles && filtredFiles[0]) {
                filteredFiles.forEach(x => {
                    if (fs.readFileSync(`./Addon_Configs/${name}/${x}`, { encoding: "utf-8" }))
                        configs[x.replace(`.${extension}`, "").toLowerCase()] =
                            YAML.parse(fs.readFileSync(`./Addon_Configs/${name}/${x}`, "utf-8"))
                })
            }
        }
        return configs;
    },
    init: () => new Promise(async (resolve, reject) => {
        if (fs.existsSync("./Addons")) {
            fs.readdir("Addons", async (err, files) => {
                files = files.filter((f) => f.split(".").pop() == "js");
                if (files) {
                    // Priority Sorting
                    let priority = { 0: [], 1: [], 2: [], 3: [] },
                        index;
                    for (index = 0; index < files.length; index++) {
                        let f = require(`../../Addons/${files[index]}`);
                        if (f._priority) {
                            if (f._priority == 1) priority[0].push(files[index]);
                            else if (f._priority == 2) priority[1].push(files[index]);
                            else if (f._priority == 3) priority[2].push(files[index]);
                            else priority[3].push(files[index]);
                        } else priority[3].push(files[index]);
                    }

                    // Priority Executing
                    for (index = 0; index <= 5; index++) {
                        let addonFiles = priority[index];
                        if (!addonFiles) continue;

                        for (let y = 0; y < addonFiles.length; y++) {
                            try {
                                const addon = require(`../../Addons/${addonFiles[y]}`);
                                if (addon && typeof addon.run == "function") {
                                    // Custom Config
                                    let customConfig = {},
                                        addonName = addon._name ? addon._name : file.replace(".js", "");

                                    if (addon._customConfigs && typeof addon._customConfigs == "object") {
                                        if (!fs.existsSync("./Addon_Configs")) await fs.mkdirSync("./Addon_Configs");
                                        if (!fs.existsSync(`./Addon_Configs/${addonName}`)) await fs.mkdirSync(`./Addon_Configs/${addonName}`);

                                        customConfig = await Utils.createMultipleConfigs(addon._customConfigs, addonName, config.Settings.DevMode);
                                    }

                                    if (addon._dependencies && Array.isArray(addon._dependencies) && addon._dependencies[0]) {

                                    }

                                    // Addon Init
                                    await addon.run(client, customConfig);

                                    // Addon Logging
                                    if (typeof addon._log == "string" && !addon._author) {
                                        console.log(chalk.hex("#007bff").bold("[INFO] ") + addon._log);
                                    } else if (addon._log && typeof addon._author == "string") {
                                        console.log(`${chalk.hex(addon._author.color || "#007bff").bold(`[${addon._author ? addon._author : "[INFO]"}]`)} ${chalk.bold(addon._name ? addon._name : file.replace(".js", ""))} addon loaded`);
                                    } else if (addon._log && typeof addon._author == "object") {
                                        console.log(`${chalk.hex(addon._author.color || "#007bff").bold(`[${addon._author.name}]`)} ${chalk.bold(addon._name ? addon._name : file.replace(".js", ""))} addon loaded`);
                                    }

                                } else {
                                    Utils.logWarning(`Unable to execute ${addon._name ? addon._name : file.replace(".js", "")} addon ${addon._author ? `by ${addon._author}` : ""}`);
                                }
                            } catch (e) {
                                if (process.argv.includes("--show-errors")) {
                                    Utils.logError(e.stack);
                                } else {
                                    Utils.logError(`An unexpected error occured from ${chalk.bold(addonFiles[y])} addon, please contact the developer.`)
                                }
                            }
                        }
                    }

                    resolve()
                }
            });
        } else {
            fs.mkdirSync("./Addons");
            resolve(await module.exports.init());
        }
    }),
    addonStructure: {
        _name: String,
        _log: String || Function,
        _author: String || Object,
        _customConfigData: Object,
        run: Function,
    },
};
