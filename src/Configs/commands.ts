import path from "path";
import { Config } from "../Modules/Structures/Handlers/Config";
import { CommandData } from "../Modules/Structures/Interfaces/Command";

type CommandsType = {
    General: {
        Info: CommandData
    }
}

const defaultConfig: CommandsType = {
    General: {
        Info: {
            Enabled: true,
            Name: "info",
            Usage: 'info <bot/user/channel/guild> [parameter]',
            Cooldown: 0,
            Permission: ["@everyone"],
            Description: "Show's Information about the Bot, User, Channel or Guild",
            DeleteCommand: false,
            SlashCommand: {
                Enabled: true,
                Data: {
                    Name: "info",
                    Description: "Show's Information about the Bot, User, Channel or Guild",
                    Options: [{
                        Type: "Sub Command",
                        Name: "bot",
                        Description: "Show's Information about a Bot",
                    }, {
                        Type: "Sub Command",
                        Name: "guild",
                        Description: "Show's Information about a Guild",
                    }, {
                        Type: "Sub Command",
                        Name: "user",
                        Description: "Show's Information about a User",
                        Options: [{
                            Type: "User",
                            Name: "user",
                            Description: "The User to show Information about",
                            Required: false
                        }]
                    }],
                }
            }
        }
    }
}

export default new Config(path.join(__dirname, "../../data/commands.yml"), defaultConfig)

export { CommandsType }