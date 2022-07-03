import { Config } from "../Modules/Structures/Handlers/Config";
import path from "path";

type ConfigType = {
    Settings: {
        Token: string;
        Prefix: string[] | string;
        DevMode: boolean;
        Verbose: boolean;
    },
    Branding: {
        Name: string;
        Color: string;
        Logo: string;
        Link: string;
    },
    ActivityStatus: {
        Mode: string;
        Activities: {
            Type: "PLAYING" | "LISTENING" | "WATCHING" | "STREAMING";
            Text: string;
            URL?: string;
        }[];
        Order: string;
        Interval: number
    }
}

const defaultConfig = {
    Settings: {
        Token: "Your-Bot-Token",
        Prefix: ["-"],
        DevMode: false,
        Verbose: false
    },
    "~l0": "Empty Line",
    Branding: {
        Name: "BrayanBot",
        Color: "#2f3136",
        Link: "https://brayanbot.dev",
        Logo: "https://avatars.githubusercontent.com/u/99198112",
    },
    "~l1": "Empty Line",
    ActivityStatus: {
        "~0": "Available modes: online | idle | dnd | offline",
        Mode: "online",
        Activities: [
            {
                Type: "PLAYING",
                Text: "discord.js",
            },
            {
                Type: "STREAMING",
                Text: "BrayanBot.dev",
                URL: "https://brayanbot.dev"
            },
            {
                Type: "LISTENING",
                Text: "for help"
            },
            {
                Type: "WATCHING",
                Text: "{guild-members} members."
            }
        ]
    }
}

export default new Config(path.join(__dirname, "../../data/config.yml"), defaultConfig)

export { ConfigType }