import path from "path";
import { Config } from "../Modules/Structures/Handlers/Config";
import { CommandData } from "../Modules/Structures/Interfaces/Command";

type CommandsType = {
    General: {
        Ping: CommandData
    }
}

const defaultConfig: CommandsType = {
    General: {
        Ping: {
            Enabled: true,
            Name: "ping",
            Usage: 'ping',
            Cooldown: 0,
            Permission: ["@everyone"],
            Description: "KOOL",
            DeleteCommand: false,
            SlashCommand: {
                Enabled: false,
                Data: {}
            }
        }
    }
}

export default new Config(path.join(__dirname, "../../data/commands.yml"), defaultConfig)

export { CommandsType }