import { Config } from "../Modules/Structures/Handlers/Config";
import { SetupMessage } from "../Modules/Utils/setupMessage";
import path from "path";

type LangType = {
    TagEmbed: SetupMessage,
    General: {
        Info: {
            BotInfo: SetupMessage,
            UserInfo: SetupMessage,
            GuildInfo: SetupMessage,
            InvalidUsage: SetupMessage,
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
        Info: {
            InvalidUsage: {
                Embeds: [{
                    Author: "{brand-name} | Invalid Usage",
                    AuthorIcon: "{brand-logo}",
                    Description: "> {user-mention}, you have to specify a valid type of information to show. Valid types are: `bot`, `user`, `channel` and `guild`.",
                    Fields: [{
                        Name: "• Usage",
                        Value: "> `{prefixUsed}info <bot/user/guild> [parameter]`"
                    }],
                    FooterIcon: "{user-pfp}",
                    Footer: "{user-tag}",
                    Timestamp: true
                }]
            },
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
                            "• System Uptime: {uptime}",
                            "• Bot Uptime: {botUptime}",
                            "• Bot API Ping: {botApiPing}",
                            "• Bot Ping: {botPing}",
                            "• Bot Ram Usage: {botRamUsage}/{botMaxRam} MB",
                            "```"
                        ].join("\n"),
                    }],
                    FooterIcon: "{user-pfp}",
                    Footer: "{user-tag}",
                    Timestamp: true
                }]
            }, 
            GuildInfo: {
                Embeds: [{
                    Author: "{guild-name}",
                    AuthorIcon: "{guild-icon}",
                    Fields: [{
                        Name: "👑 Owner",
                        Value: "> {owner-mention} ({owner-tag})"
                    }, {
                        Name: "🗓️Created",
                        Value: "> {guild-createdate}"
                    }, {
                        Name: "⚡ Boosts",
                        Value: "> {guild-boosts} Boosts (Level {guild-level})"
                    }, {
                        Name: "💠 Members",
                        Value: [
                            "> Humans - **{guild-members}**",
                            "> Bots - **{guild-bots}**",
                            "> Online - **{guild-online-members}**",
                        ].join("\n")
                    }, {
                        Name: "📊 Counters",
                        Value: [
                            "> Roles - **{guild-total-roles}**",
                            "> Members - **{guild-total-members}**",
                            "> Channels - **{guild-total-channels}**",
                            "> Stickers - **{guild-total-stickers}**",
                            "> Emojis - **{guild-total-emojis}**",
                        ].join("\n")
                    }],
                    Thumbnail: "{guild-icon}",
                    Image: "{guild-banner}",
                    FooterIcon: "{user-pfp}",
                    Footer: "{user-tag}",
                    Timestamp: true
                }],
                Components: {
                    1: [{
                        Type: "Button",
                        Style: "LINK",
                        Link: "{invite}",
                        Label: "Server Invite",
                    }]
                }
            }, 
            UserInfo: {
                Embeds: [{
                    Author: "{target-tag}'s Info",
                    AuthorIcon: "{target-pfp}",
                    Fields: [{
                        Name: "🗓️ Created",
                        Value: "> {target-createdate} | {createdSince}",
                        Inline: true
                    }, {
                        Name: "🔺 Joined",
                        Value: "> {target-joindate} | {joinSince}",
                    }, {
                        Name: "⚡ Boosting",
                        Value: "> {target-isBoosting} | {boostingSince}",
                    }, {
                        Name: "🎖 Badges",
                        Value: "> {target-badges}"
                    }],
                    FooterIcon: "{user-pfp}",
                    Thumbnail: "{target-pfp}",
                    Image: "{target-banner}",
                    Footer: "{user-tag}",
                    Timestamp: true
                }],
                Components: {
                    1: [{
                        Type: "Button",
                        Style: "LINK",
                        Link: "{target-pfp}",
                        Label: "Profile Picture",
                        Emoji: "👤"
                    }]
                }
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