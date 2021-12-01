const sqlite = require('better-sqlite3'),
    fs = require('fs'),
    { client, config, lang, commands } = require('../index.js');
const Utils = require('./Utils.js');

module.exports = {
    /**
     * 
     * @param {String} fileName 
     * @returns {sqlite}
     */
    getDatabase: async (fileName = config.Settings.Storage) => {
        return new Promise(async (resolve, reject) => {
            try {
                const db = new sqlite(fileName || "database.db");
                resolve(db)
            } catch (e) {
                reject(e)
            }
        })
    },
    /**
     * 
     * @param {sqlite} db 
     * @param {String} tableName 
     * @param {String} values 
     */
    createTable: async (db, tableName, values) => {
        return new Promise(async (resolve, reject) => {
            if(!db || !tableName || !values) {
                Utils.logWarning(`Not enough parameters passed in createTable function.`)
            } else if(db && tableName && values) {
                try {
                    Utils.logInfo(`Setting up Database. (${tableName})`)
                    db.prepare(`CREATE TABLE IF NOT EXISTS ${tableName} (${values})`).run()
                    Utils.logInfo(`Database Ready. (${tableName})`)
                } catch (err) {
                    Utils.logWarning(`An error occured while setting up database. (${tableName})`)
                    reject(err);
                }
            }
        })
    }
}