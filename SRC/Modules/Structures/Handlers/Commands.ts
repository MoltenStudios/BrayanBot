import { BrayanBot } from "../BrayanBot";
import { readdirSync } from "fs";

export class CommandHandler {
    public manager: BrayanBot;
    public commandDir: string;
    public commandDirFiles: string[];

    constructor(manager: BrayanBot, commandDir: string) {
        if(!manager) throw new Error("[BrayanBot/CommandHandler] Missing manager parameter.");
        if(!commandDir) throw new Error("[BrayanBot/CommandHandler] Missing commandDir parameter.");

        this.manager = manager;
        this.commandDir = commandDir;
        this.commandDirFiles = readdirSync(commandDir);

        return this;
    }

    async initialize() {

        return this;
    }
}

export class Command {
    constructor() {

        return this;
    }
}