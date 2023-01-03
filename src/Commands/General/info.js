import { Command } from "../../Modules/Structures/Handlers/Commands.js";
import Utils from "../../Modules/Utils.js";
import { manager } from "../../index.js";
import os from "os";
import ms from "ms";

export default new Command({
    commandData: manager.configs.commands.General.Info,
    commandConfig: {
        dmOnly: false,
        guildOnly: true,
        requiredPermissions: { user: [], bot: [] }
    },
    LegacyRun: async (manager, message, args, prefixUsed, commandData) => {
        const lang = manager.configs.lang;

        const type = args[0]
        if (!type || !["bot", "guild", "user"].includes(type.toLowerCase())) return message.reply(Utils.setupMessage({
            configPath: lang.General.Info.InvalidUsage,
            variables: [
                ...Utils.botVariables(manager),
                ...Utils.guildVariables(message.guild),
                ...Utils.userVariables(message.member),
                ...Utils.channelVariables(message.channel),
                { searchFor: /{prefixUsed}/, replaceWith: prefixUsed }
            ]
        }))

        switch (type.toLowerCase()) {
            case "bot": {
                const ping = Date.now() - message.createdTimestamp;
                const apiPing = Math.round(message.client.ws.ping);

                message.reply(Utils.setupMessage({
                    configPath: lang.General.Info.BotInfo,
                    variables: [
                        ...Utils.botVariables(manager),
                        ...Utils.guildVariables(message.guild),
                        ...Utils.userVariables(message.member),
                        ...Utils.channelVariables(message.channel),
                        { searchFor: /{botPing}/g, replaceWith: ms(ping, { long: true }) },
                        { searchFor: /{botApiPing}/g, replaceWith: ms(apiPing, { long: true }) },
                        { searchFor: /{uptime}/g, replaceWith: ms(os.uptime() * 1000, { long: true }) },
                        { searchFor: /{botRamUsage}/g, replaceWith: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0) },
                        { searchFor: /{botMaxRam}/g, replaceWith: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(0) },
                        { searchFor: /{botUptime}/g, replaceWith: ms(manager.uptime, { long: true }) },
                    ],
                }))

                break;
            }

            case "guild": {
                const vanityInvite = await message.guild?.fetchVanityData().then(vanity => vanity.code ? `https://discord.gg/${vanity.code}` : undefined).catch(() => undefined);

                let hasInvite = vanityInvite || message.guild?.invites.cache.find(invite => invite.inviterId === message.client.user.id)?.url
                if (!hasInvite) {
                    const invite = await message.guild?.invites.create(message.channelId, { maxAge: 0, maxUses: 0, unique: true });
                    hasInvite = invite?.url;
                }

                message.reply(Utils.setupMessage({
                    configPath: lang.General.Info.GuildInfo,
                    variables: [
                        ...Utils.botVariables(manager),
                        ...Utils.guildVariables(message.guild),
                        ...Utils.userVariables(message.member),
                        ...Utils.userVariables(await message.guild?.fetchOwner(), "owner"),
                        ...Utils.channelVariables(message.channel),
                        { searchFor: /{invite}/g, replaceWith: hasInvite },
                    ],
                }))
                break;
            }

            case "user": {
                const user = Utils.getUserFromMessage(message, 1, false) || message.member;
                message.reply(Utils.setupMessage({
                    configPath: lang.General.Info.UserInfo,
                    variables: [
                        ...Utils.botVariables(manager),
                        ...Utils.userVariables(user, "target"),
                        ...Utils.guildVariables(message.guild),
                        ...Utils.userVariables(message.member),
                        ...Utils.channelVariables(message.channel),
                        { searchFor: /{joinSince}/g, replaceWith: `<t:${Math.floor(user.joinedTimestamp / 1000)}:R>` },
                        { searchFor: /{boostingSince}/g, replaceWith: user.premiumSinceTimestamp ? `<t:${Math.floor(user.premiumSinceTimestamp / 1000)}:R>` : "❌" },
                        { searchFor: /{createdSince}/g, replaceWith: `<t:${Math.floor(user.user.createdTimestamp / 1000)}:R>` },
                    ]
                }))

                break;
            }
        }
    },
    InteractionRun: async (manager, interaction, commandData) => {
        const lang = manager.configs.lang;
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "bot": {
                const ping = Date.now() - interaction.createdTimestamp;
                const apiPing = Math.round(interaction.client.ws.ping);

                interaction.reply(Utils.setupMessage({
                    configPath: lang.General.Info.BotInfo,
                    variables: [
                        ...Utils.botVariables(manager),
                        ...Utils.guildVariables(interaction.guild),
                        ...Utils.userVariables(interaction.member),
                        ...Utils.channelVariables(interaction.channel),
                        { searchFor: /{botPing}/g, replaceWith: ms(ping, { long: true }) },
                        { searchFor: /{botApiPing}/g, replaceWith: ms(apiPing, { long: true }) },
                        { searchFor: /{uptime}/g, replaceWith: ms(os.uptime() * 1000, { long: true }) },
                        { searchFor: /{botRamUsage}/g, replaceWith: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0) },
                        { searchFor: /{botMaxRam}/g, replaceWith: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(0) },
                        { searchFor: /{botUptime}/g, replaceWith: ms(manager.uptime, { long: true }) },
                    ],
                }))

                break;
            }

            case "guild": {
                await interaction.deferReply()
                const vanityInvite = await interaction.guild?.fetchVanityData().then(vanity => vanity.code ? `https://discord.gg/${vanity.code}` : undefined).catch(() => undefined);

                let hasInvite = vanityInvite || interaction.guild?.invites.cache.find(invite => invite.inviterId === interaction.client.user.id)?.url
                if (!hasInvite) {
                    const invite = await interaction.guild?.invites.create(interaction.channelId, { maxAge: 0, maxUses: 0, unique: true });
                    hasInvite = invite?.url;
                }

                interaction.editReply(Utils.setupMessage({
                    configPath: lang.General.Info.GuildInfo,
                    variables: [
                        ...Utils.botVariables(manager),
                        ...Utils.guildVariables(interaction.guild),
                        ...Utils.userVariables(interaction.member),
                        ...Utils.userVariables(await interaction.guild?.fetchOwner(), "owner"),
                        ...Utils.channelVariables(interaction.channel),
                        { searchFor: /{invite}/g, replaceWith: hasInvite },
                    ],
                }))
                break;
            }

            case "user": {
                const user = interaction.options.getMember("user") || interaction.member;

                interaction.reply(Utils.setupMessage({
                    configPath: lang.General.Info.UserInfo,
                    variables: [
                        ...Utils.botVariables(manager),
                        ...Utils.userVariables(user, "target"),
                        ...Utils.guildVariables(interaction.guild),
                        ...Utils.userVariables(interaction.member),
                        ...Utils.channelVariables(interaction.channel),
                        { searchFor: /{joinSince}/g, replaceWith: `<t:${Math.floor(user.joinedTimestamp / 1000)}:R>` },
                        { searchFor: /{boostingSince}/g, replaceWith: user.premiumSinceTimestamp ? `<t:${Math.floor(user.premiumSinceTimestamp / 1000)}:R>` : "❌" },
                        { searchFor: /{createdSince}/g, replaceWith: `<t:${Math.floor(user.user.createdTimestamp / 1000)}:R>` },
                    ]
                }))

                break;
            }
        }
    },
});