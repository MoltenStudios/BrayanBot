import Utils from '../Utils';
import { SetupEmbed, setupEmbed } from './setupEmbed';
import { SetupComponents, setupComponents } from './setupComponents';
import { ActionRowBuilder, APIActionRowComponent, APIMessageActionRowComponent, AttachmentBuilder, EmbedBuilder, ReplyMessageOptions } from "discord.js";
import { manager } from '../..';

type SetupMessage = {
    Embeds?: SetupEmbed[],
    Content?: string | string[],
    Components?: SetupComponents,
    TTS?: boolean,
    Files?: {
        Path?: string,
        Name?: string,
        Spoiler?: true,
        Description?: string,
    }[],
}

type Settings = {
    configPath: SetupMessage,
    variables?: {
        searchFor: RegExp,
        replaceWith: any
    }[]
}

type Message = {
    tts?: boolean,
    content?: string,
    embeds: EmbedBuilder[],
    files?: AttachmentBuilder[],
    components?: ActionRowBuilder[]
}

/**
 * Create an Embed from given settings.
 * @param settings Settings with configPath and variables to create embed
 * @returns {Message}
 */
const setupMessage = (settings: Settings): ReplyMessageOptions => {
    const configPath = settings.configPath;
    const variables = settings.variables ?? [];
    
    variables.push(...[
        { searchFor: /{brand-color}/g, replaceWith: manager.configs.config?.Branding.Color || "#2f3136" },
        { searchFor: /{brand-name}/g, replaceWith: manager.configs.config?.Branding.Name || "BrayanBot" },
        { searchFor: /{brand-link}/g, replaceWith: manager.configs.config?.Branding.Link || "https://brayanbot.dev" },
        { searchFor: /{brand-logo}/g, replaceWith: manager.configs.config?.Branding.Logo || "https://avatars.githubusercontent.com/u/99198112" },
    ])

    const message: ReplyMessageOptions = {
        files: [], embeds: [],
        components: [],
        content: undefined,
        tts: !!configPath.TTS
    };

    const Files = configPath.Files || [];
    let Embeds = configPath.Embeds || [];
    let Components = configPath.Components || {};
    let Content = configPath.Content || undefined;

    if(Embeds.length > 10) {
        Embeds = Utils.paginateArray(Embeds, 10, 1)!;   
    }

    if(Object.keys(Components).length) {
        if(!Content || !Embeds) {
            return Utils.logger.error("Content or Embeds are required to use Components in message.")!;
        }
    }

    if(Content) {
        if(Array.isArray(Content)) Content = Utils.getRandom(Content);

        if(variables && typeof Content == "string")
            Content = Utils.applyVariables(Content, variables);

        if(typeof Content == "string" && Content.length > 2000) {
            Content = Content.substring(0, 1997) + "...";
        }

        message.content = Content as string;
    }

    if(Embeds && Array.isArray(Embeds)) {
        Embeds.forEach(configPath => message.embeds?.push(setupEmbed({ configPath, variables })))
    }

    if(Components && Object.keys(Components)[0]) {
        message.components = setupComponents({ configPath: Components, variables });
    }

    if(Files) {
        for (let index = 0; index < Files.length; index++) {
            const File = Files[index];
            
            let FilePath = File.Path || null;
            let FileName = File.Name || undefined;
            let FileSpoiler = File.Spoiler || false;
            let FileDescription = File.Description || null;

            if(variables) {
                if(FilePath && typeof FilePath == "string") FilePath = Utils.applyVariables(FilePath, variables);
                if(FileName && typeof FileName == "string") FileName = Utils.applyVariables(FileName, variables);
                if(FileDescription && typeof FileDescription == "string") FileDescription = Utils.applyVariables(FileDescription, variables);
            }
            
            if(FilePath) {
                const attachment = new AttachmentBuilder(FilePath);
                if(FileName) attachment.setName(FileName);
                if(FileSpoiler) attachment.setSpoiler(true);
                if(FileDescription) attachment.setDescription(FileDescription);

                message.files?.push(attachment);
            }
        }
    }

    return message;
}

export { setupMessage, Settings, SetupMessage, Message };