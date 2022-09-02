import { Client, Guild, GuildChannel, GuildMember, Role } from "discord.js";
import { BrayanBot } from "./Structures/BrayanBot";
import Utils from "./Utils";

export default class Variables {
    static userVariables(user: GuildMember, prefix = "user") {
        return [{
            searchFor: new RegExp(`{${prefix}-id}`, "g"),
            replaceWith: user.id,
        }, {
            searchFor: new RegExp(`{${prefix}-displayname}`, "g"),
            replaceWith: user.displayName,
        }, {
            searchFor: new RegExp(`{${prefix}-username}`, "g"),
            replaceWith: user.user.username,
        }, {
            searchFor: new RegExp(`{${prefix}-tag}`, "g"),
            replaceWith: user.user.tag,
        }, {
            searchFor: new RegExp(`{${prefix}-mention}`, "g"),
            replaceWith: "<@" + user.id + ">",
        }, {
            searchFor: new RegExp(`{${prefix}-pfp}`, "g"),
            replaceWith: user.user.displayAvatarURL({ forceStatic: false }),
        }, {
            searchFor: new RegExp(`{${prefix}-createdate}`, "g"),
            replaceWith: `<t:${Math.floor(user.user.createdTimestamp / 1000)}:D>`,
        }, {
            searchFor: new RegExp(`{${prefix}-for}`, "g"),
            replaceWith: `<t:${Math.floor(user.user.createdTimestamp / 1000)}:R>`,
        }, {
            searchFor: new RegExp(`{${prefix}-badges}`, "g"),
            replaceWith: Utils.getUserBadges(user).join(", "),
        }]
    }

    static memberVariables(member: GuildMember, prefix = "member") {
        return [{
            searchFor: new RegExp(`{${prefix}-id}`, "g"),
            replaceWith: member.id,
        }, {
            searchFor: new RegExp(`{${prefix}-displayname}`, "g"),
            replaceWith: member.displayName,
        }, {
            searchFor: new RegExp(`{${prefix}-username}`, "g"),
            replaceWith: member.user.username,
        }, {
            searchFor: new RegExp(`{${prefix}-tag}`, "g"),
            replaceWith: member.user.tag,
        }, {
            searchFor: new RegExp(`{${prefix}-mention}`, "g"),
            replaceWith: "<@" + member.id + ">",
        }, {
            searchFor: new RegExp(`{${prefix}-pfp}`, "g"),
            replaceWith: member.displayAvatarURL({ forceStatic: false }),
        }, {
            searchFor: new RegExp(`{${prefix}-createdate}`, "g"),
            replaceWith: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`,
        }, {
            searchFor: new RegExp(`{${prefix}-joindate}`, "g"),
            replaceWith: `<t:${Math.floor((member.joinedTimestamp ?? 0) / 1000)}:D>`,
        }, {
            searchFor: new RegExp(`{${prefix}-roles}`, "g"),
            replaceWith: member.roles.cache.filter(x => x.id != member.guild.roles.everyone.id)
                .map((r) => `<@&${r.id}>`).join(", "),
        }]
    }

    static channelVariables(channel: GuildChannel, prefix = "channel") {
        return [{
            searchFor: new RegExp(`{${prefix}-id}`, "g"),
            replaceWith: channel.id,
        }, {
            searchFor: new RegExp(`{${prefix}-name}`, "g"),
            replaceWith: channel.name,
        }, {
            searchFor: new RegExp(`{${prefix}-mention}`, "g"),
            replaceWith: channel.toString(),
        }, {
            searchFor: new RegExp(`{${prefix}-type}`, "g"),
            replaceWith: channel.type,
        }, {
            searchFor: new RegExp(`{${prefix}-createdate}`, "g"),
            replaceWith: `<t:${Math.floor(channel.createdTimestamp / 1000)}:D>`,
        }]
    }

    static roleVariables(role: Role, prefix = "role") {
        return [{
            searchFor: new RegExp(`{${prefix}-id}`, "g"),
            replaceWith: role.id,
        }, {
            searchFor: new RegExp(`{${prefix}-name}`, "g"),
            replaceWith: role.name,
        }, {
            searchFor: new RegExp(`{${prefix}-mention}`, "g"),
            replaceWith: role.toString(),
        }, {
            searchFor: new RegExp(`{${prefix}-createdate}`, "g"),
            replaceWith: `<t:${Math.floor(role.createdTimestamp / 1000)}:D>`,
        }, {
            searchFor: new RegExp(`{${prefix}-color}`, "g"),
            replaceWith: role.color,
        }, {
            searchFor: new RegExp(`{${prefix}-hexColor}`, "g"),
            replaceWith: role.hexColor,
        }, {
            searchFor: new RegExp(`{${prefix}-position}`, "g"),
            replaceWith: role.rawPosition,
        }, {
            searchFor: new RegExp(`{${prefix}-icon}`, "g"),
            replaceWith: role.iconURL() ?? "https://cdn-icons-png.flaticon.com/512/2522/2522053.png",
        }]
    }

    static botVariables(bot: BrayanBot, prefix = "bot") {
        return [{
            searchFor: new RegExp(`{${prefix}-id}`, "g"),
            replaceWith: bot.user?.id ?? "Unknown",
        }, {
            searchFor: new RegExp(`{${prefix}-username}`, "g"),
            replaceWith: bot.user?.username ?? "Unknown",
        }, {
            searchFor: new RegExp(`{${prefix}-tag}`, "g"),
            replaceWith: bot.user?.tag ?? "Unknown#0000",
        }, {
            searchFor: new RegExp(`{${prefix}-mention}`, "g"),
            replaceWith: "<@" + bot.user?.id + ">",
        }, {
            searchFor: new RegExp(`{${prefix}-pfp}`, "g"),
            replaceWith: bot.user?.displayAvatarURL({ forceStatic: false }) ?? "https://avatars.githubusercontent.com/u/99198112",
        }]
    }

    static guildVariables(guild: Guild, prefix = "guild") {
        return [{
            searchFor: new RegExp(`{${prefix}-id}`, "g"),
            replaceWith: guild.id
        }, {
            searchFor: new RegExp(`{${prefix}-name}`, "g"),
            replaceWith: guild.name,
        }, {
            searchFor: new RegExp(`{${prefix}-icon}`, "g"),
            replaceWith: guild.iconURL({ forceStatic: false }),
        }, {
            searchFor: new RegExp(`{${prefix}-boosts}`),
            replaceWith: guild.premiumSubscriptionCount,
        }, {
            searchFor: new RegExp(`{${prefix}-level}`),
            replaceWith: guild.premiumTier,
        }, {
            searchFor: new RegExp(`{${prefix}-max-members}`),
            replaceWith: guild.maximumMembers,
        }, {
            searchFor: new RegExp(`{${prefix}-createdate}`),
            replaceWith: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,
        }, {
            searchFor: new RegExp(`{${prefix}-members}`),
            replaceWith: guild.members.cache.filter((m) => !m.user.bot).size,
        }, {
            searchFor: new RegExp(`{${prefix}-bots}`),
            replaceWith: guild.members.cache.filter((m) => m.user.bot).size,
        }, {
            searchFor: new RegExp(`{${prefix}-total-members}`),
            replaceWith: guild.memberCount,
        }, {
            searchFor: new RegExp(`{${prefix}-total-roles}`),
            replaceWith: guild.roles.cache.size,
        }, {
            searchFor: new RegExp(`{${prefix}-total-channels}`),
            replaceWith: guild.channels.cache.size,
        }, {
            searchFor: new RegExp(`{${prefix}-total-emojis}`),
            replaceWith: guild.emojis.cache.size,
        }, {
            searchFor: new RegExp(`{${prefix}-online-members}`),
            replaceWith: guild.members.cache.filter((member) => member.presence?.status !== "offline").size,
        }, {
            searchFor: new RegExp(`{${prefix}-online-bots}`),
            replaceWith: guild.members.cache.filter((member) => member.user.bot && member.presence?.status !== "offline").size,
        }, {
            searchFor: new RegExp(`{${prefix}-online-humans}`),
            replaceWith: guild.members.cache.filter((member) => !member.user.bot && member.presence?.status == "online").size,
        }, {
            searchFor: new RegExp(`{${prefix}-idle-humans}`),
            replaceWith: guild.members.cache.filter((member) => !member.user.bot && member.presence?.status == "idle").size,
        }, {
            searchFor: new RegExp(`{${prefix}-dnd-humans}`),
            replaceWith: guild.members.cache.filter((member) => !member.user.bot && member.presence?.status == "dnd").size,
        }, {
            searchFor: new RegExp(`{${prefix}-offline-humans}`),
            replaceWith: guild.members.cache.filter((member) => !member.user.bot && member.presence?.status == "offline").size,
        }]
    }
}