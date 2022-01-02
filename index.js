const installModules = async () => {
    if (!process.argv.includes("--no-install")) {
        let childProcess = require("child_process");
        let package = require("./package.json"),
            rawModules = Object.entries(package.dependencies),
            nodeModulesArray = [],
            nodeModules = "",
            install = (name) => {
                console.log(
                    `\x1b[34m[Module Installer]`,
                    `\x1b[37mInstalling ${`\x1b[1m${nodeModulesArray.length}\x1b[0m`}\x1b[37m modules, Please wait while we install modules. This may take a few minutes.`
                );
                return new Promise(async (resolve, reject) => {
                    childProcess.exec(
                        `npm i ${name} --save`,
                        async (err, stdout) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(stdout);
                            }
                        }
                    );
                });
            };
        for (let index = 0; index < rawModules.length; index++) {
            let [module, version] = rawModules[index];
            version = version.replace("^", "");
            let moduleName = `${module}@${version}`;
            nodeModulesArray.push(moduleName);
            nodeModules += ` ${moduleName}`;
        }
        try {
            await install(nodeModules).then((res) => {
                console.log(
                    `\x1b[34m[Module Installer]`,
                    `\x1b[37m${`\x1b[1m${nodeModulesArray.length}\x1b[0m`}\x1b[37m were installed. `
                );
                if (process.argv.includes("--show-install-output")) {
                    console.log(res);
                }
            });
        } catch (e) {
            console.log(
                `\x1b[34m[Module Installer]`,
                `\x1b[37mUnable to install modules, please run "${`\x1b[1mnpm i ${nodeModules}\x1b[0m`}" to install the module.`
            );
        }
    }
};

installModules().then(() => {
    try {
        require.resolve("console-stamp");
    } catch (e) {
        if (require("fs").existsSync("node_modules")) {
            console.log(
                `\x1b[34m[Module Installer]`,
                `\x1b[37mModules installed, please restart the bot.`
            );
            process.exit(0);
        } else {
            console.log(
                `\x1b[34m[Module Installer]`,
                `\x1b[37mModules are not installed.`
            );
            process.exit(0);
        }
    }
    require("console-stamp")(console, { format: ":date(HH:MM:ss).bold.grey" });
    if (process.versions.node < 16.6)
        return require("./Modules/Utils").logError(
            `BrayanBot Requires Node.js version 16.6.0 or Higher.`
        );
    const fs = require("fs"),
        YAML = require("yaml"),
        Discord = require("discord.js"),
        client = new Discord.Client({ intents: 32767 });

    module.exports["client"] = client;
    ["config.yml", "commands.yml", "lang.yml"].forEach(
        (x) =>
            (module.exports[x.replace(".yml", "")] = YAML.parse(
                fs.readFileSync(x, "utf-8"),
                { prettyErrors: true }
            ))
    );
    ["config", "lang", "commands"].forEach(
        (x) => (client[x] = module.exports[x])
    );
    ["Events", "SlashCmds", "SlashCmdsData"].forEach((x) => (client[x] = []));
    ["Commands", "Aliases"].forEach(
        (x) => (client[x] = new Discord.Collection())
    );
    [
        "ErrorHandler.js",
        "EventHandler.js",
        "CommandHandler.js",
        "AddonHandler.js",
    ].forEach((file) => require(`./Modules/Handlers/${file}`).init());

    if (client.config.Settings.Token)
        client.login(client.config.Settings.Token);
    else return Utils.logError("An invalid token was provided.");
});
