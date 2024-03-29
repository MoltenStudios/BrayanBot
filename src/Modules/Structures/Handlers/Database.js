import BetterSql3 from "better-sqlite3";
const { Database: BtrDatabase } = BetterSql3;
import { BryanBot } from "../BryanBot.js";
import { manager } from "../../../index.js";
import path from "path";

export class DatabaseHandler {
  /** @type {BryanBot} */ manager;
  /** @type {string} */ databaseDir;
  /** @type {BtrDatabase} */ defaultDatabase;

  /** @param {BryanBot} manager @param {string} databaseDir */
  constructor(manager, databaseDir) {
    if (!manager)
      throw new Error("[NeuShore/DatabaseHandler] Missing manager parameter.");
    if (!databaseDir)
      throw new Error(
        "[NeuShore/DatabaseHandler] Missing databaseDir parameter."
      );

    this.manager = manager;
    this.databaseDir = databaseDir;
    this.defaultDatabase = new BetterSql3(
      path.join(this.databaseDir, "default.db")
    );

    return this;
  }

  async initialize() {
    const defaultTables = [{ name: "cooldown", values: "user, command, time" }];

    for (const table of defaultTables) {
      this.defaultDatabase
        .prepare(Database.createTableQuery(table.name, table.values))
        .run();
    }

    return this;
  }
}

export class Database {
  /** @type {string} */ name;
  /** @type {string} */ fileName;
  /** @type {BtrDatabase} */ database;

  /** @param {string} databaseDir */
  constructor(name) {
    if (!name) throw new Error("[NeuShore/Database] Missing name parameter.");

    this.name = name;
    this.fileName =
      this.name.includes(".db") || this.name.includes(".sqlite")
        ? this.name
        : `${this.name}.db`;
    this.database = new BetterSql3(
      path.join(manager.handlers.DatabaseHandler?.databaseDir, this.fileName)
    );

    return this;
  }

  /** @param {string} name @param {string} values */
  static createTableQuery = (name, values) =>
    `CREATE TABLE IF NOT EXISTS ${name} (${values})`;

  getDatabase() {
    return this.database;
  }

  /** @param {string} name @param {string} values */
  createTable(name, values) {
    if (!name) throw new Error("[NeuShore/Database] Missing name parameter.");
    if (!values)
      throw new Error("[NeuShore/Database] Missing values parameter.");

    this.database.prepare(Database.createTableQuery(name, values)).run();

    return this;
  }

  /** @param {{ name: string, values: string }[]} tables */
  createTables(tables) {
    if (!tables)
      throw new Error("[NeuShore/Database] Missing tables parameter.");

    for (const table of tables) this.createTable(table.name, table.values);

    return this;
  }

  /** @param {string} name */
  deleteTable(name) {
    if (!name) throw new Error("[NeuShore/Database] Missing name parameter.");

    this.database.prepare(`DROP TABLE IF EXISTS ${name}`).run();

    return this;
  }

  /** @param {string[]} */
  deleteTables(names) {
    if (!names) throw new Error("[NeuShore/Database] Missing names parameter.");

    for (const name of names) this.deleteTable(name);

    return this;
  }

  deleteAllTables() {
    const tableNames = this.database
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all()
      .map((table) => table.name);

    for (const name of tableNames) this.deleteTable(name);

    return this;
  }
}
