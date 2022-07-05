import { Guild, GuildMember, Role } from "discord.js";
import { manager } from "../index";
import chalk from "chalk";

export default class Utils {
    static logger = {
        debug: (...text: any[]) => console.log(chalk.magentaBright.bold("[DEBUG]"), ...text),
        info: (...text: any[]) =>  console.log(chalk.greenBright.bold("[INFO]"), ...text),
        warn: (...text: any[]) =>  console.log(chalk.yellowBright.bold("[WARN]"), ...text),
        error: (...text: any[]) => console.log(chalk.redBright.bold("[ERROR]"), ...text),
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
}