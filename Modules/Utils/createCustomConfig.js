const fs = require("fs"), YAML = require("yaml"), _path = require('path'),
    { client, config, lang, commands } = require("../../index");

module.exports = async (addonName, fileName, configData) => new Promise(async (resolve, reject) => {
    const folderPath = _path.join(__dirname, '../../Addon_Configs/', addonName);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    const { type, path, data } = configData;
    let returnObject = {};

    const fixFormat = () => {
        let rawYAMl = YAML.stringify(data, {
            indent: 2,
            prettyErrors: true
        })
        return rawYAMl.replace(/("|')?~(\d+)?("|')?:\s("|')?.+("|')?/g, match => "# " + match.replace(/("|')?~(\d+)?("|')?:\s/g, '')
            .replace(/("|')/g, ''))
            .replace(/("|')?~(c(\d+|))?("|')?:\s("|')?.+(\n {2}.+|)("|')?/g, match => {
                var comment = match.replace(/("|')?~(c(\d+|))?("|')?:\s/g, '');
                return (match.includes("#") ? "" : "#") + comment.substring(comment.startsWith("\"") || comment.startsWith("'") ? 1 : 0, comment.endsWith("\"") || comment.endsWith("'") ? comment.length - 1 : undefined).replace(/.+\n\s+/g, m => m.replace(/\n\s+/g, " ").replace(/\\"/g, "\""));
            }).replace(/("|')?~(l(\d+|))?("|')?:\s("|')?.+("|')?/g, "");
    }, createFile = () => new Promise(async (resolve, reject) => {
        await fs.promises.writeFile(_path.join(folderPath, `${fileName}.${type}`), fixFormat(), { encoding: "utf-8" });
        resolve(data);
    }), fileExist = () => fs.existsSync(_path.join(folderPath, `${fileName}.${type}`));

    const doesExist = fileExist();

    if (!doesExist) {
        returnObject = await createFile();
    } else if (doesExist && config.Settings.DevMode) {
        returnObject = await createFile();
    } else {
        let rawData = fs.readFileSync(_path.join(folderPath, `${fileName}.${type}`), { encoding: "utf-8" });
        returnObject = YAML.parse(rawData, { prettyErrors: true })
    }

    resolve(returnObject);
})
