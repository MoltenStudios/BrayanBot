const fs = require("fs"),
    YAML = require("yaml"),
    { client, config, lang, commands } = require("../../index");

module.exports = function (name, configData, addonName) {
    let addon_config = null;
    const generateConfig = function (path, data, type, name) {
        if (["yml", "yaml"].includes(type.toLowerCase())) {
            fs.writeFileSync(
                path,
                YAML.stringify(data, { indent: 2, prettyErrors: true })
            );
            addon_config = data;
        } else if (["json"].includes(type.toLowerCase())) {
            fs.writeFileSync(path, JSON.stringify(data, null, 4));
            addon_config = data;
        } else {
            fs.writeFileSync(path, data);
            addon_config = data;
        }

        if (!fs.existsSync(path)) {
            generateConfig(path, data, type, name);
        }
    };
    const checkPath = function (path) {
        const paths = path.split("/");
        if (paths && paths.length >= 1) {
            const dir = paths.slice(0, paths.length - 1).join("/");
            if (!fs.existsSync(dir)) {
                return fs.mkdir(dir, async (err) => {
                    if (err) {
                        return err;
                    }
                    return true;
                });
            } else return true;
        }
    };
    let { type, path, data } = configData;
    path = path.replace(/{addon-name}/g, addonName);
    checkPath(path);
    if (fs.existsSync(path)) {
        if (config.Settings.DevMode) {
            generateConfig(path, data, type, name);
        }
        if (["yml"].includes(type.toLowerCase())) {
            addon_config = YAML.parse(fs.readFileSync(path, "utf-8"), {
                prettyErrors: true,
            });
        } else if (["json"].includes(type.toLowerCase()))
            addon_config = JSON.parse(fs.readFileSync(path, "utf-8"));
        else addon_config = fs.readFileSync(path, "utf-8");
    } else {
        generateConfig(path, data, type, name);
    }
    if (addon_config && addon_config !== null) return addon_config;
    else return undefined;
};
