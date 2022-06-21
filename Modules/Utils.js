const Discord = require("discord.js"), chalk = require("chalk"),
    moment = require("moment"), axios = require("axios"),
    { client } = require("../index");

module.exports = {
    ...require("./Variables"),
    parseSlashCommands: require("./Utils/parseSlashCommand"),
    setupMessage: require("./Utils/setupMessage"),
    wait: require("util").promisify(setTimeout),
    database: require("./Handlers/Database"),
    builder: require("@discordjs/builders"),
    logWarning: (...text) => console.log(chalk.hex("#edd100").bold("[WARN] ") + text),
    logError: (...text) => console.log(chalk.hex("#ff0800").bold("[ERROR] ") + text),
    logInfo: (...text) => console.log(chalk.hex("#57ff6b").bold("[INFO] ") + text),
    logDebug: (...text) => console.log(chalk.hex("#ffff00").bold("[DEBUG] ") + text),
    /** @param {String} text @returns {String}*/
    formatFirstLetter: (text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`,
    /** @param {Array} array */
    getRandom: (array) => {
        return array[Math.floor(Math.random() * array.length)]
    },
    /**
     * Apply variables to a string.
     * @param string String to replace the variables in
     * @param variables Array of variables to search and replace
     */
    applyVariables: (string, variables) => {
        for (let i = 0; i < variables.length; i++)
            string = string.replace(variables[i].searchFor, variables[i].replaceWith);

        return string;
    },
    /**
     * Paginate array
     * @param array Array of all elements to paginate
     * @param itemsperpage Amount of items per page
     * @param page Page Number to Get
     */
    paginateArray: (array, itemsperpage, page = 1) => {
        const maxPages = Math.ceil(array.length / itemsperpage);
        if (page < 1 || page > maxPages) return null;
        return array.slice((page - 1) * itemsperpage, page * itemsperpage)
    },
    /**
     * Get info about a valid discord invite
     * @param inviteCode Invite Code to check
     */
    inviteInfo: async (inviteCode) => {
        return new Promise(async (resolve, reject) => {
            axios.get(`https://discord.com/api/v8/invites/${inviteCode}?with_counts=true`).catch(reject).then(data => data?.data).then(data => {
                data.url = data.code ? `https://discord.com/${data.code}` : null;
                data.guild.iconURL = data.guild.icon ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}?size=64` : null;
                data.guild.splashURL = data.guild.splash ? `https://cdn.discordapp.com/splashes/${data.guild.id}/${data.guild.splash}?size=64` : null;
                data.guild.bannerURL = data.guild.banner ? `https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}?size=64` : null;
                if (data.inviter) {
                    data.inviter.tag = `${data.inviter.username}#${data.inviter.discriminator}`;
                    data.inviter.avatarURL = data.inviter.avatar ? `https://cdn.discordapp.com/avatars/${data.inviter.id}/${data.inviter.avatar}?size=64` : null;
                }

                return resolve(data);
            })
        })
    },
    /**
     * @param {String} name
     * @param {Discord.Guild} guild
     * @param {String} type
     * @param {Boolean} notify
     * @returns {Discord.Channel | void}
     */
    findChannel: (name, guild, type = "GUILD_TEXT", notify = true) => {
        if (!name) return module.exports.logError(`[Utils] [findChannel] Invalid input for channel ${chalk.bold(name)}.`);
        if (!guild) return module.exports.logError(`[Utils] [findChannel] Invalid input for ${chalk.bold("guild")}.`);
        if (typeof name == "bigint" || typeof name == "number") name = name.toString();

        let returnObject = false;
        const channel = guild.channels.cache.find((c) =>
            (c.name.toLowerCase() === name.toLowerCase() || c.id === name)
            && c.type.toLowerCase() === type.toLowerCase());

        if (channel) returnObject = channel;
        else if (notify && !channel) module.exports.logError(`[Utils] [findChannel] ${chalk.bold(name)} was not found in the ${chalk.bold(guild.name)} guild`);

        return returnObject;
    },
    /**
     * @param {String} name
     * @param {Discord.TextChannel} guild
     * @param {Boolean} notify
     * @returns {Discord.Role | void}
     */
    findRole: (name, guild, notify = true) => {
        if (!name) return module.exports.logError(`[Utils] [findRole] Invalid input for role name.`);
        if (!guild) return module.exports.logError(`[Utils] [findRole] Invalid input for guild.`);
        if (typeof name == "bigint" || typeof name == "number") name = name.toString();

        let returnObject = false;
        const role = guild.roles.cache.find((r) =>
            r.name.toLowerCase() === name.toLowerCase()
            || r.id === name);

        if (role) returnObject = role;
        else if (notify) module.exports.logError(`[Utils] [findRole] ${chalk.bold(name)} role was not found in ${chalk.bold(guild.name)} guild`);

        return returnObject;
    },
    /**
     * @param {String} name 
     * @param {Discord.Client} client 
     * @param {Boolean} notify
     * @returns {Discord.Guild | void}
     */
    findGuild: (name, client, notify = true) => {
        if (!name) return module.exports.logError(`[Utils] [findGuild] Invalid input for guild name.`);
        if (!client) return module.exports.logError(`[Utils] [findGuild] Invalid input for client.`);
        if (typeof name == "bigint" || typeof name == "number") name = name.toString();

        let returnObject = false;
        const guild = client.guilds.cache.find((g) => g.name.toLowerCase() === name.toLowerCase() || g.id === name);

        if (guild) returnObject = guild;
        else if (notify) module.exports.logError(`[Utils] [findGuild] ${chalk.bold(name)} guild was not found.`);

        return returnObject;
    },
    /**
     * @param {Discord.GuildMember} member
     * @param {String | Array} name
     * @param {Boolean} notify
     * @returns {Boolean | void}
     */
    hasRole: (member, name, notify = true) => {
        if (!member) return module.exports.logError(`[Utils] [hasRole] Invalid input for ${chalk.bold("member")}.`);
        if (!name) return module.exports.logError(`[Utils] [hasRole] Invalid input for role ${chalk.bold("name")}.`);
        if (typeof name == "bigint" || typeof name == "number") name = name.toString();

        let permissions = [];
        if (Array.isArray(name) && name[0]) {
            for (let index = 0; index < name.length; index++) {
                const role = module.exports.findRole(name[index], member.guild, notify)
                if (role) {
                    if (member.roles.cache.has(role.id)) permissions.push(true);
                    else permissions.push(false);
                } else permissions.push(false);
            }
        } else if (typeof name == "string") {
            let role = module.exports.findRole(name, member.guild, notify);
            if (role) {
                if (member.roles.cache.has(role.id)) permissions.push(true);
                else permissions.push(false);
            } else permissions.push(false);
        } else module.exports.logError(`[Utils] [hasRole] Invalid type of ${chalk.bold("name")} property.`);

        return permissions.includes(true);
    },
    /**
     * @param {String} argument
     * @param {Discord.Guild} guild
     * @returns {Discord.GuildMember | void}
     */
    parseUser: (argument, guild) => {
        if (!argument) return module.exports.logError(`[Utils] [parseUser] Invalid input ${chalk.bold("argument")}.`);
        if (!guild) return module.exports.logError(`[Utils] [parseUser] Invalid input for ${chalk.bold("guild")}.`);
        if (typeof argument == "bigint" || typeof argument == "number") argument = argument.toString();

        if (argument && guild) {
            argument = argument.replace(/([<@!]|[>])/g, "");
            const user = guild.members.cache.find((user) => {
                if (user.user.id.toLowerCase() === argument.toLowerCase()) return true;
                else if (user.user.username.toLowerCase() === argument.toLowerCase()) return true;
                else if (user.user.tag.toLowerCase() === argument.toLowerCase()) return true;
                else if (user.displayName && user.displayName.toLowerCase() === argument.toLowerCase()) return true;
            });

            if (user) return user;
            else return false;
        } else return false;
    },
    /**
     * @param {Discord.Message} message
     * @param {String} argument
     * @returns {Discord.GuildMember | void}
     */
    parseUserFromMessage: (message, argument, messageMember = true) => {
        if (!message) return module.exports.logError(`[Utils] [parseUserFromMessage] Invalid input ${chalk.bold("message")}.`);
        if (!argument) return module.exports.logError(`[Utils] [parseUserFromMessage] Invalid input ${chalk.bold("argument")}.`);
        if (typeof argument == "bigint" || typeof argument == "number") argument = argument.toString();

        if (messageMember) return (message.mentions.members.first() || module.exports.parseUser(argument, message.guild) || message.member);
        else return (message.mentions.members.first() || module.exports.parseUser(argument, message.guild));
    },
    /**
     * @param {Discord.GuildMember} member
     * @returns {Array | void}
     */
    getUserBadges: (member) => {
        if (!member)
            return module.exports.logError(`[Utils] [getUserBadges] Invalid input ${chalk.bold("member")}.`);

        const badges = {
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
        }, data = [];

        if (member.user.flags) member.user.flags.toArray().forEach((flag, i) =>
            badges[flag] ? data.push(badges[flag]) : false);

        return data;
    },
    /**
     * @param {Array} choices
     * @returns {Object | void}
     */
    parseSlashArgs: function (options) {
        let args = {};
        if (typeof options !== "object" && options.length <= 0)
            return module.exports.logError("[Utils] [parseSlashArgs] Invalid Options were provided.");

        options.forEach((opt) => {
            let { type, value, name } = opt;

            args[name] = { type };
            if (["STRING", "NUMBER", "INTEGER", "BOOLEAN"].includes(type)) {
                if (value) args[name].content = value;
            } else if (["CHANNEL"].includes(type)) {
                if (opt.channel) args[name].channel = opt.channel;
            } else if (["ROLE"].includes(type)) {
                if (opt.role) args[name].role;
            } else if (["USER"].includes(type)) {
                if (opt.user) args[name].user = opt.user;
                if (opt.member) args[name].member = opt.member;
            } else if (["MENTIONABLE".includes(type)]) {
                if (opt.user) args[name].user = opt.user;
                if (opt.member) args[name].member = opt.member;
                if (opt.role) args[name].role;
            } else return module.exports.logWarning("[Utils] [parseSlashArgs] Invalid Choice Type. Type: " + type);

        });
        return args;
    },
    paste: (data, url = "https://paste.zorino.in", extension, raw) => new Promise(async (resolve, reject) => {
        axios.post(`${url}/documents`, data).then(({ data }) => {
            if (raw) url += "/raw";
            if (extension) data.key += `.${extension}`;

            resolve(`${url}/${data.key}`);
        }).catch(reject)
    }),
    /** @param {Discord.Interaction} interaction */
    sendPing: async (interaction) => new Promise(async (resolve, reject) => {
        await interaction.client.api.interactions(interaction.id, interaction.token).callback.post({
            data: { type: 6 },
        }).then((res) => resolve(res)).catch((err) => {
            if (err.message === "Unknown interaction")
                resolve(undefined);
            else reject(err);
        });
    }),
    createMultipleConfigs: async (configs, addonName) => new Promise(async (resolve, reject) => {
        if (typeof configs !== "object" && Object.keys(configs).length <= 0) {
            module.exports.logError("[Utils] [createMultipleConfigs] Invalid Configs were provided.");
            resolve({});
        }

        let addonConfigs = {}, configsEntries = Object.entries(configs),
            createCustomConfigs = require("./Utils/createCustomConfig");

        for (let index = 0; index < configsEntries.length; index++) {
            const addonConfig = configsEntries[index];
            let [name, configData] = addonConfig;
            addonConfigs[name] = await createCustomConfigs(addonName, name, configData);
        }
        resolve(addonConfigs);
    }),
    /**
     * @param {Array} array 
     * @param {Function} callback 
     */
    asyncForEach: async (array, callback) => {
        for (let index = 0; index < array.length; index++)
            await callback(array[index], index, array);
    },
    /**
     * @param {Number} bytes 
     * @param {String} seperator 
     * @returns {String}
     */
    bytesToSize: (bytes, seperator = " ") => {
        // This code is not written by any collaborators from BrayanBot
        // This code was taken from github gist
        // -> https://gist.github.com/lanqy/5193417?permalink_comment_id=2793883#gistcomment-2793883
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        if (bytes === 0) return 'N/A';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        if (i === 0) return `${bytes}${seperator}${sizes[i]}`;
        return `${(bytes / (1024 ** i)).toFixed(1)}${seperator}${sizes[i]}`;
    }
};
