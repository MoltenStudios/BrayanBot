import { BrayanBot } from "../BrayanBot";
import BetterSql3, { Database as BtrDatabase } from "better-sqlite3"
import Discord from "discord.js";
import Utils from "../../Utils";
import path from "path";
import { manager } from "../../..";

export class DatabaseHandler {
    public manager: BrayanBot;
    public databaseDir: string;
    public defaultDatabase: BtrDatabase;

    constructor(manager: BrayanBot, databaseDir: string) {
        if (!manager) throw new Error("[BrayanBot/DatabaseHandler] Missing manager parameter.");
        if (!databaseDir) throw new Error("[BrayanBot/DatabaseHandler] Missing databaseDir parameter.");

        this.manager = manager;
        this.databaseDir = databaseDir;
        this.defaultDatabase = new BetterSql3(path.join(this.databaseDir, "default.db"));

        return this;
    }

    async initialize() {
        const defaultTables = [{ name: "cooldown", values: "user, command, time" }];

        for (const table of defaultTables) {
            this.defaultDatabase.prepare(Database.createTableQuery(table.name, table.values)).run();
        }

        return this;
    }
}

export class Database {
    private name: string;
    fileName: string;
    private database: BtrDatabase;

    constructor(name: string) {
        if (!name) throw new Error("[BrayanBot/Database] Missing name parameter.");

        this.name = name;
        this.fileName = this.name.includes(".db") || this.name.includes(".sqlite") ? this.name : `${this.name}.db`;
        this.database = new BetterSql3(path.join(manager.handlers.DatabaseHandler?.databaseDir!, this.fileName));

        return this;
    }

    static createTableQuery = (name: string, values: string) => `CREATE TABLE IF NOT EXISTS ${name} (${values})`;

    getDatabase(): BtrDatabase { return this.database; }

    createTable(name: string, values: string): Database {
        if (!name) throw new Error("[BrayanBot/Database] Missing name parameter.");
        if (!values) throw new Error("[BrayanBot/Database] Missing values parameter.");

        this.database.prepare(Database.createTableQuery(name, values)).run();

        return this;
    }

    createTables(tables: { name: string, values: string }[]): Database {
        if (!tables) throw new Error("[BrayanBot/Database] Missing tables parameter.");

        for (const table of tables) this.createTable(table.name, table.values);

        return this;
    }

    deleteTable(name: string): Database {
        if (!name) throw new Error("[BrayanBot/Database] Missing name parameter.");

        this.database.prepare(`DROP TABLE IF EXISTS ${name}`).run();

        return this;
    }

    deleteTables(names: string[]): Database {
        if (!names) throw new Error("[BrayanBot/Database] Missing names parameter.");

        for (const name of names) this.deleteTable(name);

        return this;
    }

    deleteAllTables(): Database {
        const tableNames = this.database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(table => table.name);

        for (const name of tableNames) this.deleteTable(name);

        return this;
    }
}