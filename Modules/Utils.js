const Discord = require("discord.js"),
    chalk = require("chalk"),
    moment = require("moment"),
    axios = require("axios"),
    { client } = require("../index");
module.exports = {
    builder: require("@discordjs/builders"),
    wait: require("util").promisify(setTimeout),
    database: require("./Database"),
    parseComponents: require("./Utils/parseComponents"),
    parseSlashCommands: require("./Utils/parseSlashCommand"),
    setupMessage: require("./Utils/setupMessage"),
    logInfo: (text) => {
        console.log(chalk.hex("#57ff6b").bold("[INFO] ") + text);
    },
    logWarning: (text) => {
        console.log(chalk.hex("#edd100").bold("[WARN] ") + text);
    },
    logError: (text) => {
        console.log(chalk.hex("#ff0800").bold("[ERROR] ") + text);
    },
    /**
     *
     * @param {Array} array
     * @returns
     */
    getRandom: (array) => {
        let random = Math.floor(Math.random() * array.length);
        return array[random];
    },
    /**
     *
     * @param {String} text
     * @returns
     */
    formatFirstLetter: (text) => {
        return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
    },
    /**
     *
     * @param {Discord.GuildMember} user
     * @param {String} prefix
     * @returns {Array}
     */
    userVariables: (user, prefix) => {
        if (!user) {
            module.exports.logError(
                `[Utils] [userVariables] Invalid input for ${chalk.bold(
                    "user"
                )}.`
            );
            return [];
        } else {
            return [
                {
                    searchFor: new RegExp(`{${prefix || "user"}-id}`, "g"),
                    replaceWith: user.id,
                },
                {
                    searchFor: new RegExp(
                        `{${prefix || "user"}-displayname}`,
                        "g"
                    ),
                    replaceWith: user.displayName,
                },
                {
                    searchFor: new RegExp(
                        `{${prefix || "user"}-username}`,
                        "g"
                    ),
                    replaceWith: user.user.username,
                },
                {
                    searchFor: new RegExp(`{${prefix || "user"}-tag}`, "g"),
                    replaceWith: user.user.tag,
                },
                {
                    searchFor: new RegExp(`{${prefix || "user"}-mention}`, "g"),
                    replaceWith: "<@" + user.id + ">",
                },
                {
                    searchFor: new RegExp(`{${prefix || "user"}-pfp}`, "g"),
                    replaceWith: user.user.displayAvatarURL({ dynamic: true }),
                },
                {
                    searchFor: new RegExp(
                        `{${prefix || "user"}-createdat}`,
                        "g"
                    ),
                    replaceWith: moment(user.user.createdAt).format(
                        "MMMM Do YYYY, h:mm a"
                    ),
                },
            ];
        }
    },
    /**
     *
     * @param {Discord.Client} bot
     * @param {String} prefix
     * @returns {Array}
     */
    botVariables: (bot, prefix) => {
        if (!bot) {
            module.exports.logError(
                `[Utils] [botVariables] Invalid input for ${chalk.bold("bot")}.`
            );
            return [];
        } else {
            return [
                {
                    searchFor: new RegExp(`{${prefix || "bot"}-id}`, "g"),
                    replaceWith: bot.id,
                },
                {
                    searchFor: new RegExp(
                        `{${prefix || "bot"}-displayname}`,
                        "g"
                    ),
                    replaceWith: bot.displayName,
                },
                {
                    searchFor: new RegExp(`{${prefix || "bot"}-username}`, "g"),
                    replaceWith: bot.user.username,
                },
                {
                    searchFor: new RegExp(`{${prefix || "bot"}-tag}`, "g"),
                    replaceWith: bot.user.tag,
                },
                {
                    searchFor: new RegExp(`{${prefix || "bot"}-mention}`, "g"),
                    replaceWith: "<@" + bot.id + ">",
                },
                {
                    searchFor: new RegExp(`{${prefix || "bot"}-pfp}`, "g"),
                    replaceWith: bot.user.displayAvatarURL({ dynamic: true }),
                },
            ];
        }
    },
    /**
     *
     * @param {String} name
     * @param {Discord.Guild} guild
     * @param {String} type
     * @param {Boolean} notify
     * @returns {Discord.Channel}
     */
    findChannel: (name, guild, type = "GUILD_TEXT", notify = true) => {
        if (!name)
            return module.exports.logError(
                `[Utils] [findChannel] Invalid input for channel ${chalk.bold(
                    name
                )}.`
            );
        if (!guild)
            return module.exports.logError(
                `[Utils] [findChannel] Invalid input for ${chalk.bold(
                    "guild"
                )}.`
            );
        let channel = guild.channels.cache.find(
            (c) =>
                (c.name.toLowerCase() == name.toLowerCase() || c.id == name) &&
                c.type.toLowerCase() == type.toLowerCase()
        );
        if (channel) {
            return channel;
        } else {
            if (notify) {
                module.exports.logError(
                    `[Utils] [findChannel] ${chalk.bold(
                        name
                    )} was not found in the ${chalk.bold(guild.name)} guild`
                );
            }
            return false;
        }
    },
    /**
     * @param {String} name
     * @param {Discord.TextChannel} guild
     * @param {Boolean} notify
     * @returns {Discord.Role}
     */
    findRole: (name, guild, notify = true) => {
        if (!name)
            return module.exports.logError(
                `[Utils] [findRole] Invalid input for role name.`
            );
        if (!guild)
            return module.exports.logError(
                `[Utils] [findRole] Invalid input for guild.`
            );
        let role = guild.roles.cache.find(
            (r) => r.name.toLowerCase() == name.toLowerCase() || r.id == name
        );
        if (role) {
            return role;
        } else {
            if (notify) {
                module.exports.logError(
                    `[Utils] [findRole] ${chalk.bold(
                        name
                    )} role was not found in ${chalk.bold(guild.name)} guild`
                );
            }
            return false;
        }
    },
    /**
     *
     * @param {Discord.GuildMember} member
     * @param {String | Array} name
     * @param {Boolean} notify
     * @returns {Boolean}
     */
    hasRole: (member, name, notify = true) => {
        if (!member)
            return module.exports.logError(
                `[Utils] [hasRole] Invalid input for ${chalk.bold("member")}.`
            );
        if (!name)
            return module.exports.logError(
                `[Utils] [hasRole] Invalid input for role ${chalk.bold(
                    "name"
                )}.`
            );
        let permissions = [];
        if (Array.isArray(name) && name[0]) {
            for (let index = 0; index < name.length; index++) {
                const roleName = name[index];
                let role = module.exports.findRole(
                    roleName,
                    member.guild,
                    notify
                );
                if (role) {
                    if (member.roles.cache.has(role.id)) {
                        permissions.push(true);
                    } else {
                        permissions.push(false);
                    }
                } else {
                    permissions.push(false);
                }
            }
        } else if (typeof name == "string") {
            let role = module.exports.findRole(name, member.guild, notify);
            if (role) {
                if (member.roles.cache.has(role.id)) {
                    permissions.push(true);
                } else {
                    permissions.push(false);
                }
            } else {
                permissions.push(false);
            }
        } else {
            module.exports.logError(
                `[Utils] [hasRole] Invalid type of ${chalk.bold(
                    "name"
                )} property.`
            );
        }

        if (permissions.includes(true)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     *
     * @param {String} argument
     * @param {Discord.Guild} guild
     * @returns {Discord.GuildMember}
     */
    parseUser: (argument, guild) => {
        if (!argument)
            return module.exports.logError(
                `[Utils] [parseUser] Invalid input ${chalk.bold("argument")}.`
            );
        if (!guild)
            return module.exports.logError(
                `[Utils] [parseUser] Invalid input for ${chalk.bold("guild")}.`
            );

        if (argument && guild) {
            argument = argument.replace(/([<@!]|[>])/g, "");
            const user = guild.members.cache.find((user) => {
                if (user.user.id.toLowerCase() == argument.toLowerCase()) {
                    return true;
                } else if (
                    user.user.username.toLowerCase() == argument.toLowerCase()
                ) {
                    return true;
                } else if (
                    user.user.tag.toLowerCase() == argument.toLowerCase()
                ) {
                    return true;
                } else if (
                    user.displayName &&
                    user.displayName.toLowerCase() == argument.toLowerCase()
                ) {
                    return true;
                }
            });
            if (user) {
                return user;
            } else {
                return false;
            }
        } else return false;
    },
    /**
     *
     * @param {Discord.Message} message
     * @param {String} argument
     * @returns {Discord.GuildMember}
     */
    parseUserFromMessage: (message, argument, messageMember = true) => {
        if (!message)
            return module.exports.logError(
                `[Utils] [parseUserFromMessage] Invalid input ${chalk.bold(
                    "message"
                )}.`
            );
        if (!argument)
            return module.exports.logError(
                `[Utils] [parseUserFromMessage] Invalid input ${chalk.bold(
                    "argument"
                )}.`
            );

        if (messageMember) {
            return (
                message.mentions.members.first() ||
                module.exports.parseUser(argument, message.guild) ||
                message.member
            );
        } else {
            return (
                message.mentions.members.first() ||
                module.exports.parseUser(argument, message.guild)
            );
        }
    },
    /**
     *
     * @param {Discord.GuildMember} member
     * @returns {Array}
     */
    getUserBadges: (member) => {
        if (!member)
            return module.exports.logError(
                `[Utils] [getUserBadges] Invalid input ${chalk.bold("member")}.`
            );
        let badges = {
            BUGHUNTER_LEVEL_1: "Discord Bug Hunter Level 1",
            BUGHUNTER_LEVEL_2: "Discord Bug Hunter Level 2",
            DISCORD_EMPLOYEE: "Discord Staff",
            DISCORD_NITRO: "Discord Nitro",
            EARLY_SUPPORTER: "Early Supporter",
            HOUSE_BALANCE: "HypeSquad Balance",
            HOUSE_BRAVERY: "HypeSquad Bravery",
            HOUSE_BRILLIANCE: "HypeSquad Brilliance",
            HYPESQUAD_EVENTS: "HypeSquad Events",
            EARLY_VERIFIED_BOT_DEVELOPER: "Early Verified Bot Developer",
            PARTNERED_SERVER_OWNER: "Partnered Server Owner",
            DISCORD_CERTIFIED_MODERATOR: "Discord Certified Moderator",
            VERIFIED_BOT: "Verified Bot",
            TEAM_USER: "Team User",
        },
            data = [],
            flags = member.user.flags.toArray();
        flags.forEach((flag, i) => {
            if (badges[flag]) {
                data.push(badges[flag]);
            }
        });
        return data;
    },
    getChannel: (channel = null, guild) => {
        if (typeof channel === "string") {
            const ch = guild.channels.cache.find((rl) =>
                [rl.name.toLowerCase(), rl.id].includes(channel.toLowerCase())
            );
            if (ch) {
                return ch;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    },
    /**
     *
     * @param {Array} choices
     * @returns {Object}
     */
    parseSlashArgs: function (options) {
        if (typeof options !== "object" && options.length <= 0) {
            return module.exports.logError(
                "[Utils] [parseSlashArgs] Invalid Options were provided."
            );
        }

        let args = {};
        options.forEach((c) => {
            let { type, value, name } = c;
            args[name] = {
                type,
            };
            if (["STRING", "NUMBER", "INTEGER", "BOOLEAN"].includes(type)) {
                if (value) args[name].content = value;
            } else if (["CHANNEL"].includes(type)) {
                if (c.channel) args[name].channel = c.channel;
            } else if (["ROLE"].includes(type)) {
                if (c.role) args[name].role;
            } else if (["USER"].includes(type)) {
                if (c.user) args[name].user = c.user;
                if (c.member) args[name].member = c.member;
            } else if (["MENTIONABLE".includes(type)]) {
                if (c.user) args[name].user = c.user;
                if (c.member) args[name].member = c.member;
                if (c.role) args[name].role;
            } else {
                return module.exports.logWarning(
                    "[Utils] [parseSlashArgs] Invalid Choice Type. Type: " +
                    type
                );
            }
        });
        return args;
    },
    paste: (data, url = "https://paste.zorino.in", extension, raw) => {
        return new Promise(async (resolve, reject) => {
            axios.post(`${url}/documents`, data)
                .then(({ data }) => {
                    if (raw) url += "/raw";
                    if (extension) data.key += `.${extension}`;
                    resolve(`${url}/${data.key}`);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    /**
     *
     * @param {Discord.Interaction} interaction
     * @returns
     */
    sendPing: async (interaction) => {
        return new Promise(async (resolve, reject) => {
            await client.api
                .interactions(interaction.id, interaction.token)
                .callback.post({
                    data: {
                        type: 6,
                    },
                })
                .then((res) => resolve(res))
                .catch((err) => {
                    if (err.message === "Unknown interaction")
                        resolve(undefined);
                    else reject(err);
                });
        });
    },
    createMultipleConfigs: function (configs, addonName) {
        if (
            typeof configs !== "object" &&
            Object.entries(configs).length <= 0
        ) {
            return module.exports.logError(
                "[Utils] [createMultipleConfigs] Invalid Configs were provided."
            );
        }

        let addon_configs = {},
            createCustomConfigs = require("./Utils/createCustomConfig");
        configs = Object.entries(configs);

        for (let index = 0; index < configs.length; index++) {
            const addonConfig = configs[index];
            let [name, configData] = addonConfig;
            addon_configs[name] = createCustomConfigs(
                name,
                configData,
                addonName
            );
        }
        return addon_configs;
    },
    /**
     * 
     * @param {Array} array 
     * @param {Function} callback 
     */
    asyncForEach: async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    },
    /**
     * 
     * @param {Number} bytes 
     * @param {String} seperator 
     * @returns {Number}
     */
    bytesToSize: (bytes, seperator = " ") => {
        // This code is not written by any collobrators from BrayanBot
        // This code was taken from github gist
        // -> https://gist.github.com/lanqy/5193417?permalink_comment_id=2793883#gistcomment-2793883
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (bytes == 0) return 'n/a'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
        if (i === 0) return `${bytes}${seperator}${sizes[i]}`
        return `${(bytes / (1024 ** i)).toFixed(1)}${seperator}${sizes[i]}`
    }
};
