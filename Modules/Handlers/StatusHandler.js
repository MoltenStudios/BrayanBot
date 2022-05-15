const { client, config, lang, commands } = require("../../index"),
    Utils = require("../Utils"), fs = require("fs"), chalk = require("chalk"),
    path = require('path'), Discord = require("discord.js");

let ActivityStructure = {
    Text: String,
    Type: "PLAYING" | "STREAMING" | "LISTENING" | "WATCHING",
    URL: String,
}, StatusStructure = {
    Status: "online" | "idle" | "invisible" | "dnd",
    Afk: Boolean,
    Activities: ActivityStructure,
    ActivitiesSettings: {
        Order: "normal" | "random",
        Interval: Number,
    },
}, VariableStructure = {
    searchFor: String,
    replaceWith: String,
}

module.exports = {
    /**
     * 
     * @param {StatusStructure} status 
     */
    set: async (status) => {
        // Set bot status
        if (status.Status) {
            let validStatus = [
                "online", "idle", "invisible", "dnd",
                1, 2, 3, 4,
                "1", "2", "3", "4"
            ]
            let Status = status.Status.toString().toLowerCase();
            if (validStatus.includes(Status)) {
                if (["online", 1, "1"].includes(Status)) client.user.setStatus("online")
                else if (["idle", 2, "2"].includes(Status)) client.user.setStatus("idle")
                else if (["invisible", 3, "3"].includes(Status)) client.user.setStatus("invisible")
                else if (["dnd", 4, "4"].includes(Status)) client.user.setStatus("dnd")
            } else {
                Utils.logError(`[StatusHandler] Invalid Status: ${chalk.bold(status.Status)}`)
            }
        };
        // Set bot afk
        if (status.Afk) client.user.setAFK(true);
        // Set bot activity
        if (status.Activities) {
            let i = 0;
            setInterval(async () => {
                if (!status.Activities[i].Text) return Utils.logError(`[StatusHandler] Invalid ${chalk.bold("Activity Text")}. Got undefined`);
                let activity = {
                    name: status.Activities[i].Text,
                    type: null,
                    url: status.Activities[i].URL || null,
                }
                client.StatusVariables.forEach((value, key, map) => {
                    value.forEach((variable) => {
                        activity.name = activity.name.replace(variable.searchFor, variable.replaceWith)
                    })
                });
                if (status.Activities[i].Type) {
                    let validTypes = [
                        "PLAYING", "STREAMING", "LISTENING", "WATCHING",
                        1, 2, 3, 4,
                        "1", "2", "3", "4",
                    ]
                    let ActivityType = status.Activities[i].Type.toString().toUpperCase();
                    if (ActivityType && validTypes.includes(ActivityType)) {
                        if (["PLAYING", 1, "1"].includes(ActivityType)) activity.type = "PLAYING"
                        else if (["STREAMING", 2, "2"].includes(ActivityType)) activity.type = "STREAMING"
                        else if (["LISTENING", 3, "3"].includes(ActivityType)) activity.type = "LISTENING"
                        else if (["WATCHING", 4, "4"].includes(ActivityType)) activity.type = "WATCHING"
                    } else {
                        Utils.logError(`[StatusHandler] Invalid Activity Type: ${chalk.bold(status.Activities[i].Type)}`)
                    }
                }
                await client.user.setActivity(activity);
                let validOrder = [
                    "normal", "random",
                    1, 2,
                    "1", "2",
                ]
                let ActivitiesOrder = status.ActivitiesSettings.Order.toString().toLowerCase()
                if (ActivitiesOrder && validOrder.includes(ActivitiesOrder)) {
                    if (["normal", 1, "1"].includes(ActivitiesOrder)) i++
                    else if (["random", 2, "2"].includes(ActivitiesOrder)) i = Math.floor(Math.random() * status.Activities.length)
                    if (i == status.Activities.length) i = 0
                } else {
                    Utils.logError(`[StatusHandler] Invalid Activity Order: ${chalk.bold(status.ActivitiesOrder)}`)
                }
            }, status.ActivitiesSettings.Interval * 1000)
        }
        // Return success
        return true;
    },
    /**
     * @param {String} category 
     * @param {VariableStructure} variables 
     */
    addVariables: async (category, variables) => {
        let Variables = client.StatusVariables.get(category) || [];
        Variables = Variables.concat(variables);
        client.StatusVariables.set(category, Variables);
        return true;
    }
}