const sqlite = require("better-sqlite3"),
    chalk = require("chalk"),
    fs = require("fs"),
    { client, config, lang, commands } = require("../index.js");

module.exports = {
    /**
     *
     * @param {String} fileName
     * @returns {sqlite}
     */
    getDatabase: async (fileName = config.Settings.Storage) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!fs.existsSync("Database/")) await fs.mkdirSync("Database");
                const db = new sqlite(`Database/${fileName}` || "database.db");
                resolve(db);
            } catch (e) {
                reject(e);
            }
        });
    },
    /**
     *
     * @param {sqlite} db
     * @param {String} tableName
     * @param {String} values
     */
    createTable: async (db, tableName, values) => {
        return new Promise(async (resolve, reject) => {
            const Utils = require("./Utils.js");
            if (!db || !tableName || !values) {
                Utils.logWarning(
                    `Not enough parameters passed in createTable function.`
                );
            } else if (db && tableName && values) {
                try {
                    db.prepare(
                        `CREATE TABLE IF NOT EXISTS ${tableName} (${values})`
                    ).run();
                    Utils.logInfo(
                        `${chalk.bold(tableName)} Table Ready. (${chalk.bold(
                            db.name.replace("Database/", "")
                        )})`
                    );
                } catch (err) {
                    Utils.logWarning(
                        `An error occured while setting up database. (${tableName})`
                    );
                    reject(err);
                }
            }
        });
    },
};
