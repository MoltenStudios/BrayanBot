const Discord = require("discord.js"), chalk = require("chalk"),
    { MessageActionRow, MessageButton, MessageSelectMenu } = Discord;

const rowStructure = [
    {
        Type: "Button" | "SelectMenu",
        Style: "Link" | "Random" | "Primary" | "Secondary" | "Danger",
        Link: String,
        Label: String,
        Emoji: String,
        CustomID: String,
        Placeholder: String,
        Description: String,
        MaxSelect: String,
        MinSelect: String,
        Options: [
            {
                Default: Boolean,
                Label: String,
                Description: String,
                Value: String,
                Emoji: String,
            },
        ],
    },
], componentsStructure = {
    1: rowStructure,
    2: rowStructure,
    3: rowStructure,
    4: rowStructure,
    5: rowStructure,
}, messageStructure = {
    configPath: {
        Content: String,
        Embeds: [
            {
                Author: String,
                AuthorIcon: String,
                AuthorURL: String,
                URL: String,
                Title: String,
                Description: String,
                Fields: [
                    {
                        Name: String,
                        Value: String,
                        Inline: Boolean,
                    },
                ],
                Footer: String,
                FooterIcon: String,
                Thumbnail: String,
                Image: String,
                Color: String,
                Timestamp: Boolean,
            },
        ],
        Components: componentsStructure,
    },
    variables: [{ searchFor: RegExp, replaceWith: String }],
};

/**
 *
 * @param {messageStructure} settings
 * @param {boolean} ephemeral
 * @param {boolean} tts
 * @param {boolean} disableMentions
 * @param {componentsStructure} components
 * @returns
 */
module.exports = (settings, ephemeral = false, tts = false, disableMentions = false, components = null) => {
    const { config, lang, commands, client } = require("../../index"),
        Utils = require("../Utils");

    if (!settings || !settings.configPath)
        return Utils.logWarning(`[Utils] [setupMessage] Invalid ${chalk.bold("configPath")}. Got undefined`)

    let Variables = [
        { searchFor: /{brand-name}/g, replaceWith: config.Branding.Name },
        { searchFor: /{brand-logo}/g, replaceWith: config.Branding.Logo },
        { searchFor: /{brand-link}/g, replaceWith: config.Branding.Link },
    ], Embeds, Content, Components, Ephemeral = false, TTS = false, DisableMentions = false;

    if (settings.variables && Array.isArray(settings.variables))
        settings.variables.forEach(x => Variables.push(x));
    if (settings.configPath.Private || settings.configPath.private || settings.configPath.Ephemeral || settings.configPath.ephemeral) Ephemeral = true;
    if (settings.configPath.Content || settings.configPath.content)
        Content = settings.configPath.Content || settings.configPath.content;
    if (settings.configPath.Embeds || settings.configPath.embeds)
        Embeds = settings.configPath.Embeds || settings.configPath.embeds;
    else if (settings.configPath.Embed || settings.configPath.embed)
        Embeds = settings.configPath.Embed || settings.configPath.embed;
    if (components || settings.components || settings.configPath.Components || settings.configPath.components)
        Components = components || settings.components || settings.configPath.Components || settings.configPath.components;
    if (tts || settings.configPath.TTS || settings.configPath.Tts || settings.configPath.tts)
        TTS = true;
    if (disableMentions || settings.configPath.DisableMentions || settings.configPath.disableMentions || settings.configPath.disablementions)
        DisableMentions = true;

    if (Array.isArray(Content))
        Content = Content[Math.floor(Math.random() * Content.length)];

    if (Variables && typeof Variables === "object") {
        Variables.forEach((variable) => {
            if (Content) Content = Content.replace(variable.searchFor, variable.replaceWith);
        });
    }

    let messageData = {
        content: Content ? Content : null,
        embeds: Embeds && Array.isArray(Embeds) ? [] : null,
        ephemeral: ephemeral ? ephemeral : Ephemeral,
        tts: tts ? tts : TTS,
    };

    if (Embeds && Array.isArray(Embeds) && Embeds[0]) {
        for (let index = 0; index < Embeds.length; index++) {
            const embedSettings = Embeds[index];
            let Content = settings.content || embedSettings.content || embedSettings.Content,
                Title = settings.title || embedSettings.title || embedSettings.Title,
                Description = settings.description || embedSettings.description || embedSettings.Description,
                Footer = settings.footer || embedSettings.footer || embedSettings.Footer,
                FooterAvatarImage = settings.footericon || embedSettings.footericon || embedSettings.FooterIcon,
                Timestamp = settings.timestamp || embedSettings.timestamp || embedSettings.Timestamp,
                Thumbnail = settings.thumbnail || embedSettings.thumbnail || embedSettings.Thumbnail,
                Author = settings.author || embedSettings.author || embedSettings.Author,
                AuthorAvatarImage = settings.authoricon || embedSettings.authoricon || embedSettings.AuthorIcon,
                AuthorURL = settings.authorurl || embedSettings.authorurl || embedSettings.AuthorURL,
                Color = settings.color || embedSettings.color || embedSettings.Color || config.Embeds.Color || "2f3136",
                Fields = settings.fields || embedSettings.fields || embedSettings.Fields,
                Image = settings.image || embedSettings.image || embedSettings.Image,
                URL = settings.url || embedSettings.url || embedSettings.URL,
                fields = Array.isArray(Fields) ? [] : null,
                embed = new Discord.MessageEmbed();

            if (Variables && typeof Variables === "object") {
                Variables.forEach((variable) => {
                    if (Content) Content = Content.replace(variable.searchFor, variable.replaceWith);
                    if (Title) Title = Title.replace(variable.searchFor, variable.replaceWith);
                    if (Description) Description = Description.replace(variable.searchFor, variable.replaceWith);
                    if (Footer) Footer = Footer.replace(variable.searchFor, variable.replaceWith);
                    if (FooterAvatarImage) FooterAvatarImage = FooterAvatarImage.replace(variable.searchFor, variable.replaceWith);
                    if (Thumbnail) Thumbnail = Thumbnail.replace(variable.searchFor, variable.replaceWith);
                    if (Author) Author = Author.replace(variable.searchFor, variable.replaceWith);
                    if (AuthorAvatarImage) AuthorAvatarImage = AuthorAvatarImage.replace(variable.searchFor, variable.replaceWith);
                    if (AuthorURL) AuthorURL = AuthorURL.replace(variable.searchFor, variable.replaceWith);
                    if (Image) Image = Image.replace(variable.searchFor, variable.replaceWith);
                    if (URL) URL = URL.replace(variable.searchFor, variable.replaceWith);
                });
            }

            if (Fields && Array.isArray(Fields)) {
                Fields.forEach(async (field, i) => {
                    let data = {
                        name: field.Name || field.name,
                        value: field.Value || field.value,
                        inline: !!field.Inline || !!field.inline,
                    };

                    if (Variables && typeof Variables === "object") {
                        Variables.forEach((v) => {
                            data.name = data.name.replace(v.searchFor, v.replaceWith);
                            data.value = data.value.replace(v.searchFor, v.replaceWith);
                        });
                    }
                    fields.push(data);
                });
            } else if (typeof Fields == "string") {
                if (Variables && typeof Variables === "object") {
                    Variables.forEach((v) => {
                        fields = fields.replace(v.searchFor, v.replaceWith);
                    });
                }
            }

            // Randomised General
            if (Array.isArray(Title))
                Title = Title[Math.floor(Math.random() * Title.length)];
            if (Array.isArray(Description))
                Description =
                    Description[Math.floor(Math.random() * Description.length)];
            // Randomised Authors
            if (Array.isArray(Author))
                Author = Author[Math.floor(Math.random() * Author.length)];
            if (Array.isArray(AuthorAvatarImage))
                AuthorAvatarImage = AuthorAvatarImage[Math.floor(Math.random() * AuthorAvatarImage.length)];
            if (Array.isArray(AuthorURL))
                AuthorURL = AuthorURL[Math.floor(Math.random() * AuthorURL.length)];
            // Randomised Footers
            if (Array.isArray(Footer))
                Footer = Footer[Math.floor(Math.random() * Footer.length)];
            if (Array.isArray(FooterAvatarImage))
                FooterAvatarImage = FooterAvatarImage[Math.floor(Math.random() * FooterAvatarImage.length)];
            // Random Others
            if (Array.isArray(Color))
                Color = Color[Math.floor(Math.random() * Color.length)];
            if (Array.isArray(Image))
                Image = Image[Math.floor(Math.random() * Image.length)];
            if (Array.isArray(Thumbnail))
                Thumbnail = Thumbnail[Math.floor(Math.random() * Thumbnail.length)];

            if (!Title && !Author && !Description && !Fields) {
                embed.setTitle("Error")
                embed.setDescription("Atleast 1 value is requried to build a embed");

                messageData.embeds.push(embed);
            } else {
                // General
                if (Title) embed.setTitle(Title);
                if (Description) embed.setDescription(Description);
                // Author
                if (Author && AuthorAvatarImage && AuthorURL) {
                    embed.setAuthor({
                        name: Author,
                        iconURL: AuthorAvatarImage,
                        url: AuthorURL,
                    });
                } else if (Author && AuthorAvatarImage) {
                    embed.setAuthor({
                        name: Author,
                        iconURL: AuthorAvatarImage,
                    });
                } else if (Author && AuthorURL) {
                    embed.setAuthor({
                        name: Author,
                        url: AuthorURL,
                    })
                }
                // Footers
                if (Footer && FooterAvatarImage)
                    embed.setFooter({
                        text: Footer,
                        iconURL: FooterAvatarImage
                    });
                else if (Footer) embed.setFooter({
                    text: Footer
                });
                // Images
                if (Image) embed.setImage(Image);
                if (Thumbnail) embed.setThumbnail(Thumbnail);
                // Others
                if (Timestamp) embed.setTimestamp();
                if (Color) embed.setColor(Color);
                if (URL) embed.setURL(URL);
                // Fields
                if (Fields && Fields.length) {
                    fields.forEach((field) => {
                        embed.addField(field.name, field.value, field.inline);
                    });
                }
                messageData.embeds.push(embed);
            }
        }
    }
    if (Components && typeof Components == "object" && Array.isArray(Components["1"]) && Components["1"][0]) {
        messageData.components = []
        let validButtonStyles = [
            "primary", "secondary", "success", "danger", "link", "blurple", "grey",
            "green", "red", "url",
            1, 2, 3, 4, 5,
            "1", "2", "3", "4", "5",
        ], colors = ["PRIMARY", "SECONDARY", "SUCCESS", "DANGER"], rows = {
            1: new MessageActionRow(),
            2: new MessageActionRow(),
            3: new MessageActionRow(),
            4: new MessageActionRow(),
            5: new MessageActionRow(),
        }, i, y;
        for (i = 1; i <= 5; i++) {
            let rawComponent = Components[i];
            if (rawComponent) {
                rawComponent.forEach(async (comp, y) => {
                    let Type = comp.Type || comp.type,
                        Style = comp.Style || comp.style,
                        Link = comp.Link || comp.link || comp.URL || comp.url,
                        Label = comp.Label || comp.label,
                        Emoji = comp.Emoji || comp.emoji,
                        Disabled = comp.Disabled || comp.disabled || false,
                        CustomID = comp.CustomID || comp.customid,
                        Placeholder = comp.Placeholder || comp.placeholder,
                        Description = comp.Description || comp.description,
                        MaxSelect = comp.MaxSelect || comp.maxselect,
                        MinSelect = comp.MinSelect || comp.minselect,
                        Options = comp.Options || comp.options

                    if (Variables && typeof Variables === "object") Variables.forEach((variable) => {
                        if (Style) Style = Style.replace(variable.searchFor, variable.replaceWith)
                        if (Link) Link = Link.replace(variable.searchFor, variable.replaceWith)
                        if (Label) Label = Label.replace(variable.searchFor, variable.replaceWith)
                        if (Emoji) Emoji = Emoji.replace(variable.searchFor, variable.replaceWith)
                        if (CustomID) CustomID = CustomID.replace(variable.searchFor, variable.replaceWith)
                        if (Placeholder) Placeholder = Placeholder.replace(variable.searchFor, variable.replaceWith)
                        if (Description) Description = Description.replace(variable.searchFor, variable.replaceWith)
                        if (MaxSelect && typeof MaxSelect == "string") MaxSelect = MaxSelect.replace(variable.searchFor, variable.replaceWith)
                        if (MinSelect && typeof MaxSelect == "string") MinSelect = MinSelect.replace(variable.searchFor, variable.replaceWith)
                        if (Options && Array.isArray(Options) && Options[0]) Options.forEach((opts, i) => {
                            if (Options[i].Label) Options[i].Label = Options[i].Label.replace(variable.searchFor, variable.replaceWith)
                            if (Options[i].Description) Options[i].Description = Options[i].Description.replace(variable.searchFor, variable.replaceWith)
                            if (Options[i].Value) Options[i].Value = Options[i].Value.replace(variable.searchFor, variable.replaceWith)
                            if (Options[i].Emoji) Options[i].Emoji = Options[i].Emoji.replace(variable.searchFor, variable.replaceWith)
                            if (Options[i].Default && typeof Options[i].Default !== "boolean")
                                Options[i].Default = Options[i].Default.replace(variable.searchFor, variable.replaceWith)
                        })
                    })

                    if (Type) switch (Type.toLowerCase()) {
                        case 'button': {
                            if (Style.toLowerCase() == "random" || validButtonStyles.includes(Style.toLowerCase())) {
                                if (Style.toLowerCase() == "link") {
                                    if (!Link) {
                                        Utils.logError(`[Utils] [setupMessage] A link is required for button to work.`);
                                    } else if (!Label && !Emoji) {
                                        Utils.logError(`[Utils] [setupMessage] Label or Emoji is required for button to work.`);
                                    } else {
                                        let button = new MessageButton()
                                            .setStyle("LINK").setURL(Link);
                                        if (Label) button.setLabel(Label);
                                        if (Emoji) button.setEmoji(Emoji);
                                        if (Disabled) button.setDisabled(true);
                                        rows[i].addComponents([button]);
                                    }
                                } else if (!CustomID) {
                                    Utils.logError(`[Utils] [setupMessage] CustomID is required for button to work.`);
                                } else if (!Label && !Emoji) {
                                    Utils.logError(`[Utils] [setupMessage] Label or Emoji is required for button to work.`);
                                } else {
                                    let button =
                                        new MessageButton().setCustomId(CustomID);
                                    if (Style.toLowerCase() == "random") {
                                        button.setStyle(colors[Math.floor(Math.random() * colors.length)]);
                                    } else if (["primary", "blurple", 1, "1",].includes(Style.toLowerCase())) {
                                        button.setStyle("PRIMARY");
                                    } else if (["secondary", "grey", 2, "2",].includes(Style.toLowerCase())) {
                                        button.setStyle("SECONDARY");
                                    } else if (["success", "green", 3, "3",].includes(Style.toLowerCase())) {
                                        button.setStyle("SUCCESS");
                                    } else if (["danger", "red", 4, "4"].includes(Style.toLowerCase())) {
                                        button.setStyle("DANGER");
                                    }
                                    if (Label) button.setLabel(Label);
                                    if (Emoji) button.setEmoji(Emoji);
                                    if (Disabled) button.setDisabled(true);

                                    rows[i].addComponents([button]);
                                }
                            } else {
                                Utils.logError(`[Utils] [setupMessage] Invalid Button Style: ${Style}`);
                            }
                            break;
                        }
                        case 'selectmenu': {
                            if (!CustomID) {
                                Utils.logError(`[Utils] [setupMessage] CustomID is required for SelectMenu to work.`);
                            } else if (!Array.isArray(Options) || !Options[0]) {
                                Utils.logError(`[Utils] [setupMessage] SelectMenu atleast needs 1 option to work.`);
                            } else {
                                if (!MaxSelect) MaxSelect = 0;
                                if (!MinSelect) MinSelect = 0;
                                let menu = new MessageSelectMenu()
                                    .setCustomId(CustomID)
                                    .addOptions(Options.map((x) => {
                                        let data = {
                                            value: x.Value
                                        };

                                        if (x.Default) data.default = x.Default;
                                        if (x.Label) data.label = x.Label;
                                        if (x.Description) data.description = x.Description;
                                        if (x.Emoji) data.emoji = x.Emoji;

                                        return data;
                                    }));
                                if (Placeholder) menu.setPlaceholder(Placeholder);
                                if (MaxSelect) menu.setMaxValues(MaxSelect);
                                if (MinSelect) menu.setMinValues(MinSelect);
                                if (Disabled) menu.setDisabled(true);

                                rows[i].addComponents([menu]);
                            }

                            break;
                        }

                        default: {
                            Utils.logError(`[Utils] [setupMessage] Invalid Component Type`);
                            break;
                        }
                    }
                })
            }
        }
        for (let x = 1; x <= 5; x++)
            if (rows[x].components.length > 0 && rows[x].components.length <= 5)
                messageData.components.push(rows[x]);
    } else if (Components) {
        messageData.components = Components;
    }

    if (DisableMentions)
        messageData.allowedMentions = {
            parse: []
        }

    return messageData;
};
