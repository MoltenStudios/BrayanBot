import { Config } from "../Modules/Structures/Handlers/Config";
import { SetupMessage } from "../Modules/Utils/setupMessage";
import path from "path";

type LangType = {
    General: {
        Ping: SetupMessage
    },
    Miscellaneous: {
        InvalidPermissions: SetupMessage
    }
}

const defaultConfig: LangType = {
    General: {
        Ping: {
            Embeds: [{
                Author: "{brand-name}'s Ping",
                Fields: [{
                    Name: "🤖 Bot Latency",
                    Value: "> {ping}",
                    Inline: true
                }, {
                    Name: "🔗 API Latency",
                    Value: "> {apiPing}",
                    Inline: true
                }],
                AuthorIcon: "{brand-logo}",
                Timestamp: true
            }]
        }
    },
    Miscellaneous: {
        InvalidPermissions: {
            Embeds: [{
                Author: "{brand-name} • Invalid Permissions",
                Description: "> You don't have enough permission to execute this function.",
                AuthorIcon: "{brand-logo}",
                Timestamp: true
            }]
        }
    }
}

export default new Config(path.join(__dirname, "../../data/lang.yml"), defaultConfig)

export { LangType }