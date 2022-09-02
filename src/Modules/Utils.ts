import { Guild, GuildMember, Role, UserFlags, UserFlagsString } from "discord.js";
import Variables from "./Variables"
import { setupMessage } from "./Utils/setupMessage";
import chalk from "chalk";

export default class Utils {
    static logger = {
        debug: (...text: any[]) => console.log(chalk.magentaBright.bold("[DEBUG]"), ...text),
        info: (...text: any[]) =>  console.log(chalk.greenBright.bold("[INFO]"), ...text),
        warn: (...text: any[]) =>  console.log(chalk.yellowBright.bold("[WARN]"), ...text),
        error: (...text: any[]) => console.log(chalk.redBright.bold("[ERROR]"), ...text),
    }

    static setupMessage = setupMessage;
    static userVariables = Variables.userVariables;
    static roleVariables = Variables.roleVariables;
    static guildVariables = Variables.guildVariables;
    static memberVariables = Variables.memberVariables;
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
        }
        const data: string[] = []

        Object.entries(badges).forEach(([badge, value]) => 
            UserFlags[badge as UserFlagsString] ? data.push(value) : false)

        return data;
    }
}