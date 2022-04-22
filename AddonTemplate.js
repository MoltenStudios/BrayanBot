const Utils = require("../Modules/Utils");
const { Command } = require("../Modules/Handlers/CommandHandler");
const { EventListener, EventEmitter } = require("../Modules/Handlers/EventHandler");

module.exports = {
    dependencies: [],
    priority: 1,
    name: "addon-name",
    version: "1.0.0",
    log: true,
    author: {
        name: "developer-name",
        color: "hex-color-code",
    },
    customConfigs: {},
};

module.exports.run = async (bot, addonConfig) => {
    // Your code goes here
}