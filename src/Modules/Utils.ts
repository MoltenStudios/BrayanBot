import chalk from "chalk";
import Variables from "./Variables"
import { setupMessage } from "./Utils/setupMessage";
import { loadCommands } from "./Utils/loadCommands";
import { setupSlashCommand } from "./Utils/setupSlashCommand";
import {
    Guild,
    GuildMember,
    Role,
    Message,
    UserFlagsString,
    ChannelType,
    TextChannel,
    VoiceChannel,
    CategoryChannel,
    DMChannel
} from "discord.js";

export default class Utils {
    static logger = {
        debug: (...text: any[]) => console.log(chalk.magentaBright.bold("[DEBUG]"), ...text),
        info: (...text: any[]) =>  console.log(chalk.greenBright.bold("[INFO]"), ...text),
        warn: (...text: any[]) =>  console.log(chalk.yellowBright.bold("[WARN]"), ...text),
        error: (...text: any[]) => console.log(chalk.redBright.bold("[ERROR]"), ...text),
    }

    static loadCommands = loadCommands; static setupMessage = setupMessage; static setupSlashCommand = setupSlashCommand;
    static botVariables = Variables.botVariables; static userVariables = Variables.userVariables;
    static roleVariables = Variables.roleVariables; static guildVariables = Variables.guildVariables;
    static channelVariables = Variables.channelVariables;

    static getRandom(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static applyVariables(string: string, variables: { 
        searchFor: RegExp,
        replaceWith: any
    }[]) {
        return variables.reduce((output, variable) => output.replace(variable.searchFor, variable.replaceWith), string);
    }

    static paginateArray (array: Array<any>, itemsperpage: number, page = 1): Array<any> | null {
        const maxPages = Math.ceil(array.length / itemsperpage);
        if (page < 1 || page > maxPages) return null;
        return array.slice((page - 1) * itemsperpage, page * itemsperpage)
    }

    static findRole(guild: Guild, name: string | number, notify = true): Role | undefined | void {
        const roleName = typeof name === "number" ? name.toString() : name;
        const role = guild.roles.cache.find((r) => {
            return r.name.toLowerCase() === roleName.toLowerCase() || r.id === roleName.toLowerCase();
        });

        if (!role && notify) {
            this.logger.error(`The role with the name or ID "${chalk.bold(name)}" was not found in the "${chalk.bold(guild.name)}" server.`);
        }
        
        return role;
    }

    static findMember(guild: Guild, name: string | number, notify = false): GuildMember | undefined | void {
        const memberName = typeof name === "number" ? name.toString() : name;
        const member = guild.members.cache.find((m) => {
            return m.user.tag.toLowerCase() === memberName.toLowerCase() || m.id.toLowerCase() === memberName.toLowerCase() || m.user.username.toLowerCase() === memberName.toLowerCase();
        });

        if (!member && notify) {
            this.logger.error(`The member with the username or ID "${chalk.bold(name)}" was not found in the "${chalk.bold(guild.name)}" server.`);
        }

        return member;
    }
    
    static findChannel(type: ChannelType, guild: Guild, name: string | number, notify = false): TextChannel | VoiceChannel | DMChannel | CategoryChannel | undefined {
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
                if (notify) this.logger.error(`The ${chalk.bold(ChannelType[type].toString())} channel named "${chalk.bold(name)}" could not be found in the "${chalk.bold( guild.name )}" server. Please check the channel name and its type and try again.`);
        }
    }

    
    static hasPermission (permissions: string[], member: GuildMember): Boolean {
        return permissions.some((perm: any) => {
            const isRolePermission = this.findRole(member.guild, perm, false);
            if(isRolePermission && member.roles.cache.has(isRolePermission.id)) return true

            const isMemberPermission = this.findMember(member.guild, perm, false);
            if(isMemberPermission && member.id == isMemberPermission.id) return true;
        })
    }

    static getUserBadges (member: GuildMember) {
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
            .filter(([badge, _]) => member.user.flags?.has(badge as UserFlagsString))
            .map(([_, value]) => value);
    }

    static getUserFromMessage(message: Message, arg = 0, checkFull = false) {
        const args = message.content.split(" "); args.shift();
        const toFind = checkFull ? args.join(" ") : (args[arg] || '');
        
        return message.mentions.members?.first() 
            ||  message.guild!.members.cache.find(member => 
                    member.user.tag.toLowerCase() == toFind.toLowerCase() 
                    || member.displayName.toLowerCase() == toFind.toLowerCase() 
                    || member.user.username.toLowerCase() == toFind.toLowerCase() 
                    || member.id == toFind.replace(/([<@!]|[>])/g, "")
                );
    }
}