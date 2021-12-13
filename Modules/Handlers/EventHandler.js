const { client, config, lang, commands } = require("../../index"),
    fs = require("fs");
module.exports = {
    set: (name, parameter) => {
        client.Events.push(name);
        client.on(name, (...parameters) => {
            parameter(client, ...parameters);
        });
    },
    init: () => {
        const eventFiles = fs
            .readdirSync("./Events")
            .filter((file) => file.endsWith(".js"));
        for (let i = 0; i < eventFiles.length; i++) {
            const file = eventFiles[i];
            const event = require(`../../Events/${file}`);
            module.exports.set(file.replace(".js", ""), event);
        }
    },
};
