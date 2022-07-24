const setupComponents = require("./setupComponents");
const setupEmbed = require("./setupEmbed");

const SetupMessage = {
    TTS: Boolean,
    Embeds: [setupEmbed.SetupEmbed],
    Content: [String] | String,
    Components: [setupComponents.SetupComponents],
    Files: [{
        Path: String,
        Name: String,
        Spoiler: true,
        Description: String,
    }],
}, Settings = {
    configPath: SetupMessage,
    variables: [{ searchFor: RegExp, replaceWith: String }]
}

/** @param {Settings} settings */
module.exports = (settings) => {
    if (!settings || !settings.configPath) {
        throw new Error(`[Utils] [setupMessage] Invalid ConfigPath. Received: ${settings.configPath}`)
    }

    const Utils = require("../Utils");
    const { config } = require("../../index"), configPath = settings.configPath, variables = [
        { searchFor: /{brand-name}/g, replaceWith: config.Branding.Name },
        { searchFor: /{brand-logo}/g, replaceWith: config.Branding.Logo },
        { searchFor: /{brand-link}/g, replaceWith: config.Branding.Link },
        ...settings.variables ?? []
    ];


    const message = {
        files: [], embeds: [], components: [],
        content: configPath.Content || undefined,
        tts: !!configPath.TTS
    };

    let Content = configPath.Content || undefined;
    let Components = configPath.Components || {};
    let Embeds = configPath.Embeds || [];
    let Files = configPath.Files || [];

    if (Object.keys(Components).length && !Content && !Embeds) {
        throw new Error(`[Utils] [setupMessage] Content or Embeds are required to use Components in message.`);
    } else if (Embeds.length > 10) {
        Embeds = Utils.paginateArray(Embeds, 10, 1);
    }

    if (Embeds && typeof Embeds == "object" && !Array.isArray(Embeds)) Embeds = [Embeds];
    if (Files && typeof Files == "object" && !Array.isArray(Files)) Files = [Files];


    if (Content) {
        if (Array.isArray(Content)) Content = Utils.getRandom(Content);

        if (variables && typeof Content == "string")
            Content = Utils.applyVariables(Content, variables);

        if (typeof Content == "string" && Content.length > 2000) {
            Content = Content.substring(0, 1997) + "...";
        }

        message.content = Content;
    }

    if (Embeds && Array.isArray(Embeds)) {
        Embeds.forEach(configPath => message.embeds.push(setupEmbed({
            configPath, variables
        })))
    }

    if (Components && Object.keys(Components).length) {
        message.components = setupComponents({
            configPath: Components,
            variables: variables
        });
    }

    if (Files) {
        for (let index = 0; index < Files.length; index++) {
            const File = Files[index];

            let FilePath = File.Path || null;
            let FileName = File.Name || undefined;
            let FileDescription = File.Description || null;

            if (variables) {
                if (FilePath && typeof FilePath == "string") FilePath = Utils.applyVariables(FilePath, variables);
                if (FileName && typeof FileName == "string") FileName = Utils.applyVariables(FileName, variables);
                if (FileDescription && typeof FileDescription == "string") Utils.FileDescription = applyVariables(FileDescription, variables);
            }

            if (!FileName) {
                throw new Error(`[Utils] [setupMessage] FileName is required to use Files in message.`);
            }

            const attachment = new MessageAttachment(FilePath).setName(FileName);
            if (File.Spoiler) attachment.setSpoiler(!!File.Spoiler);
            if (FileDescription) attachment.setDescription(FileDescription);

            message.files.push(attachment);
        }
    }

    return message;
};