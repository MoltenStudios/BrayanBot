const { client, config, lang, commands } = require("../../index"),
    fs = require("fs"), path = require('path'), Discord = require("discord.js");

module.exports = {
    EventListener: class EventListener {

        /**
         * @callback executeFunction
         * @param {Discord.Client} client
         * @param {...} params
         */

        /**
         * @param {String} name 
         * @param {executeFunction} executeFunction 
         */
        constructor(name = null, executeFunction = (client) => { }) {
            if (name && executeFunction && typeof executeFunction == "function") {
                this.name = name;
                this.executeFunction = executeFunction;

                client.Events.push(name);
                client.on(this.name, async (...params) => await executeFunction(client, ...params));
            }
        }
    },
    EventEmitter: class EventEmitter {
        /**
         * @param {String} name 
         * @param {Array} params
         */
        constructor(name = null, ...params) {
            if (name && params.length > 0) client.emit(name, ...params);
        }
    },
    set: (name, parameter) => new module.exports.EventListener(name, parameter),
    init: () => {
        const eventFiles = fs.readdirSync(path.join(__dirname, "../../Events"))
            .filter((file) => file.endsWith(".js"));

        for (let i = 0; i < eventFiles.length; i++) {
            const file = require(`../../Events/${eventFiles[i]}`);
            if (file) new module.exports.EventListener(eventFiles[i].replace(".js", ""), typeof file == "function" ? file
                : typeof file.run == "function" ? file.run : () => { });
        }
    }
}