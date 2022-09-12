const sqlite = require("better-sqlite3");
const Discord = require("discord.js");
const chalk = require("chalk");
const fs = require("fs");

module.exports = {
    /** @type {sqlite.prototype} */ db: {},
    init: () => new Promise(async (resolve) => {
        module.exports.db = await module.exports.getDatabase();
        const tables = [{
            name: "cooldowns",
            values: "user, command, time"
        }];

        tables.forEach(({ name, values }) => module.exports.createTable(module.exports.db, name, values));
        resolve(tables);
    }),
    /** 
     * @param {String} fileName
     * @returns {sqlite.prototype} */
    getDatabase: async (fileName) => new Promise(async (resolve, reject) => {
        const { config } = require("../../index");
        try {
            if (!fileName) fileName = config.Settings.Storage
            if (!fs.existsSync("Database/")) await fs.mkdirSync("Database");
            const db = new sqlite(`Database/${fileName}` || "database.db");
            resolve(db);
        } catch (e) {
            reject(e);
        }
    }),
    /** 
     * @param {sqlite} db
     * @param {String} tableName
     * @param {String} values */
    createTable: async (db, tableName, values) => new Promise(async (resolve, reject) => {
        const { config } = require("../../index");
        const Utils = require("../Utils");

        if (!db) db = await module.exports.db;
        if (!tableName || !values) {
            Utils.logWarning(`Not enough parameters passed in createTable function.`);
        } else if (db && tableName && values) {
            try {
                db.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${values})`).run();
                if (config.Settings.DbReady)
                    Utils.logTable(`${chalk.bold(tableName)} Table Ready. (${chalk.bold(db.name.replace("Database/", ""))})`);
            } catch (err) {
                Utils.logWarning(`An error occured while setting up database. (${tableName})`);
                reject(err);
            }
        }
    }), cooldowns: {
        set: (command, userID, ms = 0) => module.exports.db.prepare(`INSERT INTO cooldowns (user, command, time)VALUES(?,?,?)`).run(userID, command, (Date.now() + ms)),
        reset: (command, userID, ms = 0) => module.exports.db.prepare(`UPDATE cooldowns SET time=? WHERE user=? AND command=?`).run(Date.now() + ms, userID, command),
        remove: (command, userID) => module.exports.db.prepare(`DELETE FROM cooldowns WHERE user=? AND command=?`).run(userID, command),
    },
}