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
    TextChannel,
  } from "discord.js";

export default class Utils {
    static logger = {
        debug: (...text: any[]) => console.log(chalk.magentaBright.bold("[DEBUG]"), ...text),
        info: (...text: any[]) =>  console.log(chalk.greenBright.bold("[INFO]"), ...text),
        warn: (...text: any[]) =>  console.log(chalk.yellowBright.bold("[WARN]"), ...text),
        error: (...text: any[]) => console.log(chalk.redBright.bold("[ERROR]"), ...text),
    }

    static loadCommands = loadCommands;
    static setupMessage = setupMessage;
    static setupSlashCommand = setupSlashCommand;
    static botVariables = Variables.botVariables;
    static userVariables = Variables.userVariables;
    static roleVariables = Variables.roleVariables;
    static guildVariables = Variables.guildVariables;
    static channelVariables = Variables.channelVariables;

    static getRandom(array: any[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static applyVariables(string: string, variables: { 
        searchFor: RegExp,
        replaceWith: any
    }[]) {
        for(let i = 0; i < variables.length; i++) 
            string = string.replace(variables[i].searchFor, variables[i].replaceWith);
    
        return string;
    }

    static paginateArray (array: Array<any>, itemsperpage: number, page = 1): Array<any> | null {
        const maxPages = Math.ceil(array.length / itemsperpage);
        if (page < 1 || page > maxPages) return null;
        return array.slice((page - 1) * itemsperpage, page * itemsperpage)
    }

    static findRole(guild: Guild, name: string | number, notify = true): Role | undefined | void {
        const role = guild.roles.cache.find((r) => {
            if(typeof name == "string") {
                return r.name.toLowerCase() == name.toLowerCase()
                    || r.id == name;
            } else if(typeof name == "number") {
                return r.name.toLowerCase() == name.toString().toLowerCase()
                    || r.id == name.toString().toLowerCase();
            } else return false;
        });

        if(!role && notify) return this.logger.error(`Role "${chalk.bold(name)}" was not found in "${chalk.bold(guild.name)}" server.`);
        else return role;
    }

    static findMember(guild: Guild, name: string | number, notify = false): GuildMember | undefined | void {
        const member = guild.members.cache.find((m) => {
            if(typeof name == "string") {
                return m.user.tag.toLowerCase() == name.toLowerCase() 
                    || m.id == name.toLowerCase();
            } else if(typeof name == "number") {
                return m.user.tag.toLowerCase() == name.toString().toLowerCase()
                    || m.id == name.toString().toLowerCase();
            } else return false;
        }) 

        if(!member && notify) return this.logger.error(`GuildMember "${chalk.bold(name)}" was not found in "${chalk.bold(guild.name)}" server.`);
        else return member;
    }
    
    static findChannel(guild: Guild, name: string | number, notify = false): TextChannel | undefined | void {
        const channel = guild.channels.cache.find((c) => {
            if(typeof name == "string") {
                return c.name.toLowerCase() == name.toLowerCase()
                    || c.id == name;
            } else if(typeof name == "number") {
                return c.name.toLowerCase() == name.toString().toLowerCase()
                    || c.id == name.toString().toLowerCase();
            } else return false;
        })
        if (channel instanceof TextChannel) {
            return channel;
        } else {
            if(!channel && notify) return this.logger.error(`Channel "${chalk.bold(name)}" was not found in "${chalk.bold(guild.name)}" server.`);
            return;
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
        const data: string[] = []

        Object.entries(badges).forEach(([badge, value]) => {
            if(member.user.flags?.has(badge as UserFlagsString)) data.push(value)
        })

        return data;
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