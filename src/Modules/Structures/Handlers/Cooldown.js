import { Database } from './Database.js';
import Discord from 'discord.js';
import Utils from '../Utils.js';

const cooldownDatabase = new Database("default.db")
    .createTable("cooldown", "user, command, time");
const database = cooldownDatabase.getDatabase();

export { cooldownDatabase, database }
export default class Cooldown {
    static createCooldown(command, userId, ms = 0) {
        database.prepare(`INSERT INTO cooldowns (user, command, time)VALUES(?,?,?)`).run(userId, command, (Date.now() + ms));
    }

    static resetCooldown(command, userId, ms = 0) {
        database.prepare(`UPDATE cooldowns SET time=? WHERE user=? AND command=?`).run(Date.now() + ms, userId, command)
    }

    static removeCooldown(command, userId) {
        database.prepare(`DELETE FROM cooldowns WHERE user=? AND command=?`).run(userId, command)
    }
}