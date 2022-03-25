const installModules = async () => {
    if (!process.argv.includes("--no-install")) {
        let childProcess = require("child_process"),
            package = require("./package.json"),
            rawModules = Object.entries(package.dependencies),
            nodeModulesArray = [], nodeModules = "", install = (name) => {
                console.log(`\x1b[34m[Module Installer]`, `\x1b[37mInstalling ${`\x1b[1m${nodeModulesArray.length}\x1b[0m`}\x1b[37m modules, Please wait while we install modules. This may take a few minutes.`);
                return new Promise(async (resolve, reject) => {
                    childProcess.exec(`npm i ${name} --save`, async (err, stdout) => err ? reject(err) : resolve(stdout));
                });
            };
        for (let index = 0; index < rawModules.length; index++) {
            let [module, version] = rawModules[index];
            version = version.replace("^", "");
            let moduleName = module == "chalk" ? `${module}@${version}` : `${module}@latest`;
            nodeModulesArray.push(moduleName);
            nodeModules += ` ${moduleName}`;
        }
        try {
            await install(nodeModules).then((res) => {
                console.log(`\x1b[34m[Module Installer]`, `\x1b[37m${`\x1b[1m${nodeModulesArray.length}\x1b[0m`}\x1b[37m were installed. `);
                if (process.argv.includes("--show-install-output")) {
                    console.log(res);
                }
            });
        } catch (e) {
            console.log(`\x1b[34m[Module Installer]`, `\x1b[37mUnable to install modules, please run "${`\x1b[1mnpm i \x1b[0m`}" to install the module.`);
        }
    }
};

const installNodeModules = async () => new Promise(async (resolve, reject) => {
    const showOutput = process.argv.includes("--show-install-output"),
        package = require("./package.json"),
        { spawn } = require("child_process"),
        modules = [
            ...Object.keys(package.dependencies),
            ...Object.keys(package.optionalDependencies)
        ];

    console.log(`\x1b[34m[Module Installer]`, `\x1b[37mInstalling ${`\x1b[1m${modules.length}\x1b[0m`}\x1b[37m modules, Please wait while we install modules. This may take a few minutes.`);
    let data = spawn(process.platform == "win32" ? "npm.cmd" : "npm", ["install", ...modules]);
    data.stdout.on("data", (data) => {
        showOutput ? console.log(`\x1b[34m[Module Installer: stdout]\x1b[0m`, data.toString().trim()) : "";
    })
    data.stderr.on("data", (data) => {
        showOutput ? console.log(`\x1b[34m[Module Installer: stderr]\x1b[0m`, data.toString().trim()) : ""
    })
    data.on("exit", (code) => {
        console.log(`\x1b[34m[Module Installer]`, `\x1b[37m${`\x1b[1m${modules.length}\x1b[0m`}\x1b[37m were installed. `);
        resolve(code);
    })
})

installNodeModules().then(() => {
    if (!process.argv.includes("--no-install")) {
        try {
            require.resolve("console-stamp");
        } catch (e) {
            if (require("fs").existsSync("node_modules")) {
                console.log(`\x1b[34m[Module Installer]`, `\x1b[37mModules installed, please restart the bot.`);
                process.exit(0);
            } else {
                console.log(`\x1b[34m[Module Installer]`, `\x1b[37mModules are not installed.`);
                process.exit(0);
            }
        }
    }
    require("console-stamp")(console, { format: ":date(HH:MM:ss).bold.grey" });
    const Utils = require("./Modules/Utils")
    if (process.versions.node < 16.6)
        return Utils.logError(`BrayanBot Requires Node.js version 16.6.0 or Higher.`);

    const fs = require("fs"), YAML = require("yaml"),
        Discord = require("discord.js"),
        client = new Discord.Client({
            intents: Object.keys(Discord.Intents.FLAGS).map(x => Discord.Intents.FLAGS[x])
        });

    module.exports["client"] = client;
    ["config.yml", "commands.yml", "lang.yml"].forEach((x) => module.exports[x.replace(".yml", "")] = YAML.parse(fs.readFileSync(x, "utf-8"), { prettyErrors: true }));
    ["config", "lang", "commands"].forEach((x) => (client[x] = module.exports[x]));
    ["Events", "SlashCmds", "SlashCmdsData"].forEach((x) => (client[x] = []));
    ["Commands", "Aliases", "Routes"].forEach((x) => (client[x] = new Discord.Collection()));
    Utils.asyncForEach([
        "ErrorHandler.js", "EventHandler.js", "CommandHandler.js", "AddonHandler.js", "ExpressHandler.js"
        , "AddonHandler2.js"
    ], async (file, index) => {
        await require(`./Modules/Handlers/${file}`).init()
    })
    if (client.config.Settings.Token)
        client.login(client.config.Settings.Token);
    else return Utils.logError("An invalid token was provided.");
});