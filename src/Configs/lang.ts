import { Config } from "../Modules/Structures/Handlers/Config";
import { SetupMessage } from "../Modules/Utils/setupMessage";
import path from "path";

type LangType = {
    TagEmbed: SetupMessage,
    General: {
        Ping: SetupMessage
    },
    Miscellaneous: {
        InvalidPermissions: SetupMessage
    }
}

const defaultConfig: LangType = {
    TagEmbed: {
        Embeds: [{
            Author: "{brand-name}",
            AuthorIcon: "{brand-logo}",
            Description: "> [**BrayanBot's Website**]({brand-link})",
            Fields: [{
                Name: "📖 Open Source",
                Value: "> This bot's base is open source, you can find the source code [here](https://github.com/brayanbot/brayanbot)."
            }, {
                Name: "⚡ Blazing fast!",
                Value: "> No unnecessary packages or dependencies! Doesn't get any more lightweight."
            }, {
                Name: "⚙ Easy to Customize",
                Value: "> Every message is customizable. Change them all you want!"
            }, {
                Name: "💻 Cross-Platform",
                Value: "> ARM, Linux, MacOS, Windows... Inside Docker or on Pterodactyl. We support all of them!"
            }],
            Footer: "{user-tag}",
            Timestamp: true
        }]
    },
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
                FooterIcon: "{user-pfp}",
                Footer: "{user-tag}",
                Timestamp: true
            }]
        }
    }
}

export default new Config(path.join(__dirname, "../../data/lang.yml"), defaultConfig)

export { LangType }