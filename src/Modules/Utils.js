import { ChannelType, TextChannel, VoiceChannel, CategoryChannel, DMChannel } from "discord.js";
import { setupSlashCommand } from "./Utils/setupSlashCommand.js";
import { setupMessage } from "./Utils/setupMessage.js";
import { loadCommands } from "./Utils/loadCommands.js";
import { botVariables, channelVariables, guildVariables, roleVariables, userVariables } from "./Variables.js"
import chalk from "chalk";

export default class Utils {
    static logger = {
        debug: (...text) => console.log(chalk.magentaBright.bold("[DEBUG]"), ...text),
        info: (...text) => console.log(chalk.greenBright.bold("[INFO]"), ...text),
        warn: (...text) => console.log(chalk.yellowBright.bold("[WARN]"), ...text),
        error: (...text) => console.log(chalk.redBright.bold("[ERROR]"), ...text),
    }

    static loadCommands = loadCommands; static setupMessage = setupMessage; static setupSlashCommand = setupSlashCommand;
    static botVariables = botVariables; static userVariables = userVariables;
    static roleVariables = roleVariables; static guildVariables = guildVariables;
    static channelVariables = channelVariables;

    static getRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static applyVariables(string, variables) {
        return variables.reduce((output, variable) => output.replace(variable.searchFor, variable.replaceWith), string);
    }

    static paginateArray(array, itemsperpage, page = 1) {
        const maxPages = Math.ceil(array.length / itemsperpage);
        if (page < 1 || page > maxPages) return null;
        return array.slice((page - 1) * itemsperpage, page * itemsperpage)
    }

    static findRole(guild, name, notify = true) {
        const roleName = typeof name === "number" ? name.toString() : name;
        const role = guild.roles.cache.find((r) => {
            return r.name.toLowerCase() === roleName.toLowerCase() || r.id === roleName.toLowerCase();
        });

        if (!role && notify) {
            this.logger.error(`The role with the name or ID "${chalk.bold(name)}" was not found in the "${chalk.bold(guild.name)}" server.`);
        }

        return role;
    }

    static findMember(guild, name, notify = false) {
        const memberName = typeof name === "number" ? name.toString() : name;
        const member = guild.members.cache.find((m) => {
            return m.user.tag.toLowerCase() === memberName.toLowerCase() || m.id.toLowerCase() === memberName.toLowerCase() || m.user.username.toLowerCase() === memberName.toLowerCase();
        });

        if (!member && notify) {
            this.logger.error(`The member with the username or ID "${chalk.bold(name)}" was not found in the "${chalk.bold(guild.name)}" server.`);
        }

        return member;
    }

    static findChannel(type, guild, name, notify = false) {
        if (typeof name === "number") name = name.toString();
        const channels = guild.channels.cache.filter(channel => channel.type === type);
        const channel = channels.find(ch => ch.name === name || ch.id === name);

        switch (type) {
            case ChannelType.GuildText:
                return channel instanceof TextChannel ? channel : undefined;
            case ChannelType.GuildVoice:
                return channel instanceof VoiceChannel ? channel : undefined;
            case ChannelType.DM:
                return channel instanceof DMChannel ? channel : undefined;
            case ChannelType.GuildCategory:
                return channel instanceof CategoryChannel ? channel : undefined;
            case ChannelType.PrivateThread:
                return channel instanceof TextChannel ? channel : undefined;
            default:
                if (notify) this.logger.error(`The ${chalk.bold(ChannelType[type].toString())} channel named "${chalk.bold(name)}" could not be found in the "${chalk.bold(guild.name)}" server. Please check the channel name and its type and try again.`);
        }
    }


    static hasPermission(permissions, member) {
        if (!Array.isArray(permissions)) permissions = [permissions];
        return permissions.some((perm) => {
            const isRolePermission = this.findRole(member.guild, perm, false);
            if (isRolePermission && member.roles.cache.has(isRolePermission.id)) return true

            const isMemberPermission = this.findMember(member.guild, perm, false);
            if (isMemberPermission && member.id == isMemberPermission.id) return true;
        })
    }

    static getUserBadges(member) {
        const badges = {
            BugHunterLevel1: "Discord Bug Hunter Level 1",
            BugHunterLevel2: "Discord Bug Hunter Level 2",
            Staff: "Discord Staff",
            PremiumEarlySupporter: "Early Supporter",
            HypeSquadOnlineHouse3: "HypeSquad Balance",
            HypeSquadOnlineHouse1: "HypeSquad Bravery",
            HypeSquadOnlineHouse2: "HypeSquad Brilliance",
            Hypesquad: "HypeSquad Events",
            VerifiedDeveloper: "Early Verified Bot Developer",
            Partner: "Partnered Server Owner",
            CertifiedModerator: "Discord Certified Moderator",
            VerifiedBot: "Verified Bot",
            TeamPseudoUser: "Team User",
            Spammer: "Spammer",
            Quarantined: "Quarantined"
        }

        return Object.entries(badges)
            .filter(([badge, _]) => member.user.flags?.has(badge))
            .map(([_, value]) => value);
    }

    static getUserFromMessage(message, arg = 0, checkFull = false) {
        const args = message.content.split(" "); args.shift();
        const toFind = checkFull ? args.join(" ") : (args[arg] || '');

        return message.mentions.members?.first()
            || message.guild.members.cache.find(member =>
                member.user.tag.toLowerCase() == toFind.toLowerCase()
                || member.displayName.toLowerCase() == toFind.toLowerCase()
                || member.user.username.toLowerCase() == toFind.toLowerCase()
                || member.id == toFind.replace(/([<@!]|[>])/g, "")
            );
    }
}