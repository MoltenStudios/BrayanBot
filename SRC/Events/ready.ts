import { Client } from "discord.js";
import { EventListener } from "../Modules/Structures/Handlers/Events";

export default new EventListener("ready", (client: Client) => {
    console.log("ready from ready.ts")
});