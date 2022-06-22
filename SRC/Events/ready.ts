import { Client } from "discord.js";
import { EventListener } from "../Modules/Structures/Handlers/Events";

new EventListener("ready", (client: Client) => {
    console.log("ready from ready.ts")
});