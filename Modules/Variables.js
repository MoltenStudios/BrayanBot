module.exports = {
    /**
     * @param {Discord.GuildMember} user
     * @param {String} prefix
     * @returns {String[]}
     */
    userVariables: (user, prefix = "user") => {
        const Utils = require("./Utils");
        let returnObject = [];

        if (user) returnObject = [{
            searchFor: new RegExp(`{${prefix || "user"}-id}`, "g"),
            replaceWith: user.id,
        }, {
            searchFor: new RegExp(`{${prefix || "user"}-displayname}`, "g"),
            replaceWith: user.displayName,
        }, {
            searchFor: new RegExp(`{${prefix || "user"}-username}`, "g"),
            replaceWith: user.user.username,
        }, {
            searchFor: new RegExp(`{${prefix || "user"}-tag}`, "g"),
            replaceWith: user.user.tag,
        }, {
            searchFor: new RegExp(`{${prefix || "user"}-mention}`, "g"),
            replaceWith: "<@" + user.id + ">",
        }, {
            searchFor: new RegExp(`{${prefix || "user"}-pfp}`, "g"),
            replaceWith: user.user.displayAvatarURL({ dynamic: true }),
        }, {
            searchFor: new RegExp(`{${prefix || "user"}-createdate}`, "g"),
            replaceWith: `<t:${Math.floor(user.user.createdTimestamp / 1000)}:D>`,
        }, {
            searchFor: new RegExp(`{${prefix || "user"}-for}`, "g"),
            replaceWith: `<t:${Math.floor(user.user.createdTimestamp / 1000)}:R>`,
        }, {
            searchFor: new RegExp(`{${prefix || "user"}-badges}`, "g"),
            replaceWith: Utils.getUserBadges(user).join(", "),
        }];

        if (!user) Utils.logError(`[Utils] [userVariables] Invalid input for ${chalk.bold("user")}.`);

        return returnObject;
    },
    /**
     * @param {Discord.GuildMember} member
     * @param {String} prefix
     * @returns {String[]}
     */
    memberVariables: (member, prefix = "member") => {
        const Utils = require("./Utils");
        let returnObject = [];

        if (member) returnObject = [{
            searchFor: new RegExp(`{${prefix || "member"}-id}`, "g"),
            replaceWith: member.id,
        }, {
            searchFor: new RegExp(`{${prefix || "member"}-displayname}`, "g"),
            replaceWith: member.displayName,
        }, {
            searchFor: new RegExp(`{${prefix || "member"}-username}`, "g"),
            replaceWith: member.user.username,
        }, {
            searchFor: new RegExp(`{${prefix || "member"}-tag}`, "g"),
            replaceWith: member.user.tag,
        }, {
            searchFor: new RegExp(`{${prefix || "member"}-mention}`, "g"),
            replaceWith: "<@" + member.id + ">",
        }, {
            searchFor: new RegExp(`{${prefix || "member"}-pfp}`, "g"),
            replaceWith: member.displayAvatarURL({ dynamic: true }),
        }, {
            searchFor: new RegExp(`{${prefix || "member"}-createdate}`, "g"),
            replaceWith: `<t:${Math.floor(member.createdTimestamp / 1000)}:D>`,
        }, {
            searchFor: new RegExp(`{${prefix || "member"}-joindate}`, "g"),
            replaceWith: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`,
        }, {
            searchFor: new RegExp(`{${prefix || "member"}-for}`, "g"),
            replaceWith: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        }, {
            searchFor: new RegExp(`{${prefix || "member"}-roles}`, "g"),
            replaceWith: member.roles.cache.filter(x => x.id != member.guild.roles.everyone.id).map((r) => `<@&${r.id}>`).join(", "),
        }];

        if (!member) Utils.logError(`[Utils] [memberVariables] Invalid input for ${chalk.bold("member")}.`);

        return returnObject;
    },
    /**
     * 
     * @param {Discord.Channel} channel 
     * @param {String} prefix 
     * @returns {Array<Object>}
    */
    channelVariables: (channel, prefix = "user") => {
        const Utils = require("./Utils");
        let returnObject = [];

        if (channel) returnObject = [{
            searchFor: new RegExp(`{${prefix || "channel"}-id}`, "g"),
            replaceWith: channel.id,
        }, {
            searchFor: new RegExp(`{${prefix || "channel"}-name}`, "g"),
            replaceWith: channel.name,
        }, {
            searchFor: new RegExp(`{${prefix || "channel"}-mention}`, "g"),
            replaceWith: channel.toString(),
        }, {
            searchFor: new RegExp(`{${prefix || "channel"}-type}`, "g"),
            replaceWith: channel.type,
        }, {
            searchFor: new RegExp(`{${prefix || "channel"}-createdate}`, "g"),
            replaceWith: `<t:${Math.floor(channel.createdTimestamp / 1000)}:D>`,
        }]

        if (!channel) Utils.logError(`[Utils] [channelVariables] Invalid input for ${chalk.bold("channel")}.`);

        return returnObject;
    },
    /**
     * 
     * @param {Discord.Role} role 
     * @param {String} prefix 
     * @returns 
     */
    roleVariables: (role, prefix = "role") => {
        const Utils = require("./Utils");
        let returnObject = [];

        if (role) returnObject = [{
            searchFor: new RegExp(`{${prefix || "role"}-id}`, "g"),
            replaceWith: role.id,
        }, {
            searchFor: new RegExp(`{${prefix || "role"}-name}`, "g"),
            replaceWith: role.name,
        }, {
            searchFor: new RegExp(`{${prefix || "role"}-mention}`, "g"),
            replaceWith: role.toString(),
        }, {
            searchFor: new RegExp(`{${prefix || "role"}-createdate}`, "g"),
            replaceWith: `<t:${Math.floor(role.createdTimestamp / 1000)}:D>`,
        }, {
            searchFor: new RegExp(`{${prefix || "role"}-color}`, "g"),
            replaceWith: role.color,
        }, {
            searchFor: new RegExp(`{${prefix || "role"}-hexColor}`, "g"),
            replaceWith: role.hexColor,
        }, {
            searchFor: new RegExp(`{${prefix || "role"}-position}`, "g"),
            replaceWith: role.rawPosition,
        }, {
            searchFor: new RegExp(`{${prefix || "role"}-icon}`, "g"),
            replaceWith: role.iconURL() || "https://cdn-icons-png.flaticon.com/512/2522/2522053.png",
        }]

        if (!role) Utils.logError(`[Utils] [roleVariables] Invalid input for ${chalk.bold("role")}.`);

        return returnObject;
    },
    /**
     * @param {Discord.Client} bot
     * @param {String} prefix
     * @returns {Object[]}
     */
    botVariables: (bot, prefix = "bot") => {
        const Utils = require("./Utils");
        let returnObject = [];

        if (bot) returnObject = [{
            searchFor: new RegExp(`{${prefix || "bot"}-id}`, "g"),
            replaceWith: bot.id,
        }, {
            searchFor: new RegExp(`{${prefix || "bot"}-displayname}`, "g"),
            replaceWith: bot.displayName,
        }, {
            searchFor: new RegExp(`{${prefix || "bot"}-username}`, "g"),
            replaceWith: bot.user.username,
        }, {
            searchFor: new RegExp(`{${prefix || "bot"}-tag}`, "g"),
            replaceWith: bot.user.tag,
        }, {
            searchFor: new RegExp(`{${prefix || "bot"}-mention}`, "g"),
            replaceWith: "<@" + bot.id + ">",
        }, {
            searchFor: new RegExp(`{${prefix || "bot"}-pfp}`, "g"),
            replaceWith: bot.user.displayAvatarURL({ dynamic: true }),
        }]

        if (!bot) Utils.logError(`[Utils] [botVariables] Invalid input for ${chalk.bold("bot")}.`);

        return returnObject;
    }
}