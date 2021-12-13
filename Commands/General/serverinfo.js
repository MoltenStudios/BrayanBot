const Discord = require("discord.js"),
    Utils = require("../../Modules/Utils"),
    { lang, config, commands } = require("../../index"),
    { SlashCommandBuilder } = Utils.builder,
    moment = require("moment");

module.exports = {
    name: "serverinfo",
    type: "general",
    commandData: commands.General.ServerInfo,
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Array} args
 * @param {Object} config
 */
module.exports.run = async (bot, message, args, config) => {
    let guildVariables = await module.exports.fetchGuildVariables(
        message.guild,
        "guild"
    );
    message.channel.send(
        Utils.setupMessage({
            configPath: lang.General.ServerInfo,
            variables: [
                ...Utils.userVariables(message.member),
                ...Utils.userVariables(
                    Utils.parseUser(message.guild.ownerId, message.guild),
                    "guild-owner"
                ),
                ...Utils.botVariables(bot),
                ...guildVariables,
            ],
        })
    );
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Interaction} interaction
 */
module.exports.runSlash = async (bot, interaction) => {
    let guildVariables = await module.exports.fetchGuildVariables(
        interaction.guild,
        "guild"
    );
    interaction.reply(
        Utils.setupMessage(
            {
                configPath: lang.General.ServerInfo,
                variables: [
                    ...Utils.userVariables(interaction.member),
                    ...Utils.userVariables(
                        Utils.parseUser(
                            interaction.guild.ownerId,
                            interaction.guild
                        ),
                        "guild-owner"
                    ),
                    ...Utils.botVariables(bot),
                    ...guildVariables,
                ],
            },
            true
        )
    );
};

module.exports.fetchGuildVariables = async (guild, prefix = "guild") => {
    let members = await guild.members.fetch();
    return [
        { searchFor: new RegExp(`{${prefix}-id}`, "g"), replaceWith: guild.id },
        {
            searchFor: new RegExp(`{${prefix}-name}`, "g"),
            replaceWith: guild.name,
        },
        {
            searchFor: new RegExp(`{${prefix}-icon}`, "g"),
            replaceWith: guild.iconURL({ dynamic: true }),
        },
        {
            searchFor: new RegExp(`{${prefix}-boosts}`),
            replaceWith:
                guild.premiumSubscriptionCount == "NONE"
                    ? 0
                    : guild.premiumSubscriptionCount,
        },
        {
            searchFor: new RegExp(`{${prefix}-level}`),
            replaceWith: guild.premiumTier,
        },
        {
            searchFor: new RegExp(`{${prefix}-max-members}`),
            replaceWith: guild.maximumMembers,
        },
        {
            searchFor: new RegExp(`{${prefix}-createdat}`),
            replaceWith: moment(guild.createdAt).format("MMMM Do YYYY, h:mm a"),
        },
        {
            searchFor: new RegExp(`{${prefix}-online-members}`),
            replaceWith: guild.members.cache.filter(
                (member) =>
                    member.presence &&
                    (member.presence.status !== "offline").size
            ),
        },
        {
            searchFor: new RegExp(`{${prefix}-online-bots}`),
            replaceWith: guild.members.cache.filter(
                (member) =>
                    member.presence &&
                    member.presence.status !== "offline" &&
                    member.user.bot
            ).size,
        },
        {
            searchFor: new RegExp(`{${prefix}-members}`),
            replaceWith: members.filter((m) => !m.user.bot).size,
        },
        {
            searchFor: new RegExp(`{${prefix}-bots}`),
            replaceWith: members.filter((m) => m.user.bot).size,
        },
        {
            searchFor: new RegExp(`{${prefix}-total-members}`),
            replaceWith: guild.memberCount,
        },
        {
            searchFor: new RegExp(`{${prefix}-total-roles}`),
            replaceWith: guild.roles.cache.size,
        },
        {
            searchFor: new RegExp(`{${prefix}-total-channels}`),
            replaceWith: guild.channels.cache.size,
        },
        {
            searchFor: new RegExp(`{${prefix}-total-emojis}`),
            replaceWith: guild.emojis.cache.size,
        },
        {
            searchFor: new RegExp(`{${prefix}-online-humans}`),
            replaceWith: guild.members.cache.filter(
                (member) =>
                    member.presence &&
                    member.presence.status == "online" &&
                    !member.user.bot
            ).size,
        },
        {
            searchFor: new RegExp(`{${prefix}-idle-humans}`),
            replaceWith: guild.members.cache.filter(
                (member) =>
                    member.presence &&
                    member.presence.status == "idle" &&
                    !member.user.bot
            ).size,
        },
        {
            searchFor: new RegExp(`{${prefix}-dnd-humans}`),
            replaceWith: guild.members.cache.filter(
                (member) =>
                    member.presence &&
                    member.presence.status == "dnd" &&
                    !member.user.bot
            ).size,
        },
        {
            searchFor: new RegExp(`{${prefix}-offline-humans}`),
            replaceWith: guild.members.cache.filter(
                (member) =>
                    member.presence &&
                    member.presence.status == "offline" &&
                    !member.user.bot
            ).size,
        },
    ];
};
