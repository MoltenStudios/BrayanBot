const fs = require("fs"),
    YAML = require("yaml"),
    chalk = require("chalk"),
    Utils = require("../Utils"),
    { SlashCommandBuilder } = require("@discordjs/builders"),
    { client, config, lang, commands } = require("../../index");

module.exports = {
    getConfig: (name, config, extension = "yml") => {
        if (
            fs.existsSync("./Addon_Configs") &&
            fs.existsSync(`./Addon_Configs/${name}/${config}.${extension}`)
        ) {
            return YAML.parse(
                fs.readFileSync(
                    `./Addon_Configs/${name}/${config}.${extension}`,
                    "utf-8"
                )
            );
        } else {
            return false;
        }
    },
    getYAMLConfig: (name, config) => {
        if (
            fs.existsSync("./Addon_Configs") &&
            fs.existsSync(`./Addon_Configs/${name}/${config}.yml`)
        ) {
            return YAML.parse(
                fs.readFileSync(
                    `./Addon_Configs/${name}/${config}.yml`,
                    "utf-8"
                )
            );
        } else {
            return false;
        }
    },
    init: async () => {
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
                            if (f._priority == 1)
                                priority[0].push(files[index]);
                            else if (f._priority == 2)
                                priority[1].push(files[index]);
                            else if (f._priority == 3)
                                priority[2].push(files[index]);
                            else priority[3].push(files[index]);
                        } else priority[3].push(files[index]);
                    }

                    // Priority Executing
                    for (index = 0; index <= 5; index++) {
                        let addonFiles = priority[index];
                        if (addonFiles) {
                            for (let y = 0; y < addonFiles.length; y++) {
                                try {
                                    const addon = require(`../../Addons/${addonFiles[y]}`);
                                    if (
                                        addon &&
                                        typeof addon.run == "function"
                                    ) {
                                        // Custom Config
                                        let customConfig = {},
                                            addonName = addon._name
                                                ? addon._name
                                                : file.replace(".js", "");
                                        if (
                                            addon._customConfigs &&
                                            typeof addon._customConfigs ==
                                                "object"
                                        ) {
                                            if (
                                                !fs.existsSync(
                                                    "./Addon_Configs"
                                                )
                                            )
                                                await fs.mkdirSync(
                                                    "./Addon_Configs"
                                                );
                                            if (
                                                !fs.existsSync(
                                                    `./Addon_Configs/${addonName}`
                                                )
                                            )
                                                await fs.mkdirSync(
                                                    `./Addon_Configs/${addonName}`
                                                );

                                            customConfig =
                                                Utils.createMultipleConfigs(
                                                    addon._customConfigs,
                                                    addonName
                                                );
                                        }
                                        // Executing Addon
                                        await addon.run(client, customConfig);

                                        // Addon Logging
                                        if (
                                            typeof addon._log == "string" &&
                                            !addon._author
                                        ) {
                                            console.log(
                                                chalk
                                                    .hex("#007bff")
                                                    .bold("[INFO] ") +
                                                    addon._log
                                            );
                                        } else if (
                                            addon._log &&
                                            typeof addon._author == "string"
                                        ) {
                                            console.log(
                                                `${chalk
                                                    .hex(
                                                        addon._author.color ||
                                                            "#007bff"
                                                    )
                                                    .bold(
                                                        `[${
                                                            addon._author
                                                                ? addon._author
                                                                : "[INFO]"
                                                        }]`
                                                    )} ${chalk.bold(
                                                    addon._name
                                                        ? addon._name
                                                        : file.replace(
                                                              ".js",
                                                              ""
                                                          )
                                                )} addon loaded`
                                            );
                                        } else if (
                                            addon._log &&
                                            typeof addon._author == "object"
                                        ) {
                                            console.log(
                                                `${chalk
                                                    .hex(
                                                        addon._author.color ||
                                                            "#007bff"
                                                    )
                                                    .bold(
                                                        `[${addon._author.name}]`
                                                    )} ${chalk.bold(
                                                    addon._name
                                                        ? addon._name
                                                        : file.replace(
                                                              ".js",
                                                              ""
                                                          )
                                                )} addon loaded`
                                            );
                                        }
                                    } else {
                                        Utils.logWarning(
                                            `Unable to execute ${
                                                addon._name
                                                    ? addon._name
                                                    : file.replace(".js", "")
                                            } addon ${
                                                addon._author
                                                    ? `by ${addon._author}`
                                                    : ""
                                            }`
                                        );
                                    }
                                } catch (e) {
                                    console.log(e);
                                    Utils.logError(e);
                                }
                            }
                        }
                    }
                }
            });
        } else {
            fs.mkdirSync("./Addons");
            await module.exports.init();
        }
    },
    addonStructure: {
        _name: String,
        _log: String || Function,
        _author: String || Object,
        _customConfigData: Object,
        run: Function,
    },
};
