import { Config } from "../Modules/Structures/Handlers/Config";
import { SetupMessage } from "../Modules/Utils/setupMessage";
import path from "path";

type LangType = {
    TagEmbed: SetupMessage,
    General: {
        Ping: SetupMessage,
        Info: {
            BotInfo: SetupMessage,
        }
    },
    Miscellaneous: {
        InvalidRolePermissions: SetupMessage,
        InvalidBotPermissions: SetupMessage,
        InvalidUserPermissions: SetupMessage,
        DMOnly: SetupMessage,
        GuildOnly: SetupMessage,
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
        },
        Info: {
            BotInfo: {
                Embeds: [{
                    Author: "{brand-name}",
                    AuthorIcon: "{brand-logo}",
                    Description: "> BrayanBot is a modern Discord bot written with latest DiscordJS features in mind that provide an easy-to-use ecosystem for developers and a robust bot base for Server Owners.",
                    Fields: [{
                        Name: "• Information",
                        Value: [
                            "> [**BrayanBot's Website**]({brand-link})",
                            "> [**BrayanBot's GitHub**](https://github.com/brayanbot/brayanbot)",
                            "> [**BrayanBot's Discord**](https://discord.gg/G4AV33KeqF)",
                        ].join("\n")
                    }, {
                        Name: "• Statistics",
                        Value: [
                            "```yml",
                            "• Bot Ram Usage: {botRamUsage}/{botMaxRam} MB",
                            "• Bot Uptime: {botUptime}",
                            "• System Uptime: {uptime}",
                            "```"
                        ].join("\n"),
                    }],
                    FooterIcon: "{user-pfp}",
                    Footer: "{user-tag}",
                    Timestamp: true
                }]
            },
        }
    },
    Miscellaneous: {
        InvalidRolePermissions: {
            Private: true,
            Embeds: [{
                Author: "{brand-name} • Invalid Permissions",
                Description: "> You don't have enough role permission to execute this function.",
                AuthorIcon: "{brand-logo}",
                FooterIcon: "{user-pfp}",
                Footer: "{user-tag}",
                Timestamp: true
            }]
        },
        InvalidBotPermissions: {
            Private: true,
            Embeds: [{
                Author: "{brand-name} • Invalid Bot Permissions",
                Description: "> Bot does't have enough base permission to execute this function.",
                AuthorIcon: "{brand-logo}",
                FooterIcon: "{user-pfp}",
                Footer: "{user-tag}",
                Timestamp: true
            }]
        },
        InvalidUserPermissions: {
            Private: true,
            Embeds: [{
                Author: "{brand-name} • Invalid Bot Permissions",
                Description: "> You don't have enough base permission to execute this function.",
                AuthorIcon: "{brand-logo}",
                FooterIcon: "{user-pfp}",
                Footer: "{user-tag}",
                Timestamp: true
            }]
        },
        DMOnly: {
            Private: true,
            Embeds: [{
                Author: "{brand-name} • Invalid Channel Type",
                Description: "> This command can only be executed in Direct Messages.",
                AuthorIcon: "{brand-logo}",
                FooterIcon: "{user-pfp}",
                Footer: "{user-tag}",
                Timestamp: true
            }]
        },
        GuildOnly: {
            Private: true,
            Embeds: [{
                Author: "{brand-name} • Invalid Channel Type",
                Description: "> This command can only be executed a Guild.",
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