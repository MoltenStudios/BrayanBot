const Discord = require("discord.js"),
    { MessageActionRow, MessageButton, MessageSelectMenu } = Discord,
    Utils = require("../Utils"),
    parseComponents = require("./parseComponents"),
    { config, lang, commands, client } = require("../../index");

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
],
    componentsStructure = {
        1: rowStructure,
        2: rowStructure,
        3: rowStructure,
        4: rowStructure,
        5: rowStructure,
    },
    messageStructure = {
        configPath: {
            Content: String,
            Embeds: [
                {
                    Author: String,
                    AuthorIcon: String,
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
 * @param {componentsStructure} components
 * @returns
 */
module.exports = (settings, ephemeral = false, components = null) => {
    let Variables = [
        { searchFor: /{branding}/g, replaceWith: config.Embeds.Branding },
    ],
        Embeds,
        Content,
        Components,
        Ephemeral = false;

    if (settings.variables)
        Variables = [
            ...settings.variables,
            { searchFor: /{branding}/g, replaceWith: config.Embeds.Branding },
        ];
    if (
        settings.configPath.Private ||
        settings.configPath.private ||
        settings.configPath.Ephemeral ||
        settings.configPath.ephemeral
    )
        Ephemeral = true;
    if (settings.configPath.Content || settings.configPath.content)
        Content = settings.configPath.Content || settings.configPath.content;
    if (settings.configPath.Embeds || settings.configPath.embeds)
        Embeds = settings.configPath.Embeds || settings.configPath.embeds;
    else if (settings.configPath.Embed || settings.configPath.embed)
        Embeds = settings.configPath.Embed || settings.configPath.embed;
    if (
        components ||
        settings.components ||
        settings.configPath.Components ||
        settings.configPath.components
    )
        Components =
            components ||
            settings.components ||
            settings.configPath.Components ||
            settings.configPath.components;

    if (Array.isArray(Content))
        Content = Content[Math.floor(Math.random() * Content.length)];
    if (Variables && typeof Variables === "object") {
        Variables.forEach((variable) => {
            if (Content)
                Content = Content.replace(
                    variable.searchFor,
                    variable.replaceWith
                );
        });
    }
    let messageData = {
        content: Content ? Content : null,
        embeds: Embeds && Array.isArray(Embeds) ? [] : null,
        ephemeral: ephemeral ? ephemeral : Ephemeral,
        components: Components ? parseComponents(Components, Variables) : null,
    };
    if (Embeds && Array.isArray(Embeds) && Embeds[0]) {
        for (let index = 0; index < Embeds.length; index++) {
            const embedSettings = Embeds[index];
            let Content =
                settings.content ||
                embedSettings.content ||
                embedSettings.Content,
                Title =
                    settings.title ||
                    embedSettings.title ||
                    embedSettings.Title,
                Description =
                    settings.description ||
                    embedSettings.description ||
                    embedSettings.Description,
                Footer =
                    settings.footer ||
                    embedSettings.footer ||
                    embedSettings.Footer,
                FooterAvatarImage =
                    settings.footericon ||
                    embedSettings.footericon ||
                    embedSettings.FooterIcon,
                Timestamp =
                    settings.timestamp ||
                    embedSettings.timestamp ||
                    embedSettings.Timestamp,
                Thumbnail =
                    settings.thumbnail ||
                    embedSettings.thumbnail ||
                    embedSettings.Thumbnail,
                Author =
                    settings.author ||
                    embedSettings.author ||
                    embedSettings.Author,
                AuthorAvatarImage =
                    settings.authoricon ||
                    embedSettings.authoricon ||
                    embedSettings.AuthorIcon,
                Color =
                    settings.icon ||
                    embedSettings.color ||
                    embedSettings.Color ||
                    config.Embeds.Color ||
                    "2f3136",
                Fields =
                    settings.fields ||
                    embedSettings.fields ||
                    embedSettings.Fields,
                Image =
                    settings.image ||
                    embedSettings.image ||
                    embedSettings.Image,
                URL = settings.url || embedSettings.url || embedSettings.URL,
                fields = Array.isArray(Fields) ? [] : null,
                embed = new Discord.MessageEmbed();

            if (Variables && typeof Variables === "object") {
                Variables.forEach((variable) => {
                    if (Content)
                        Content = Content.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                    if (Title)
                        Title = Title.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                    if (Description)
                        Description = Description.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                    if (Footer)
                        Footer = Footer.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                    if (FooterAvatarImage)
                        FooterAvatarImage = FooterAvatarImage.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                    if (Thumbnail)
                        Thumbnail = Thumbnail.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                    if (Author)
                        Author = Author.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                    if (AuthorAvatarImage)
                        AuthorAvatarImage = AuthorAvatarImage.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                    if (Image)
                        Image = Image.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                    if (URL)
                        URL = URL.replace(
                            variable.searchFor,
                            variable.replaceWith
                        );
                });
            }

            if (Fields && Array.isArray(Fields)) {
                Fields.forEach(async (field, i) => {
                    let data = {
                        name: field.Name || field.name,
                        value: field.Value || field.value,
                        inline: field.Inline || field.inline,
                    };

                    if (Variables && typeof Variables === "object") {
                        Variables.forEach((v) => {
                            data.name = data.name.replace(
                                v.searchFor,
                                v.replaceWith
                            );
                            data.value = data.value.replace(
                                v.searchFor,
                                v.replaceWith
                            );
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
                AuthorAvatarImage =
                    AuthorAvatarImage[Math.floor(Math.random() * AuthorAvatarImage.length)];
            // Randomised Footers
            if (Array.isArray(Footer))
                Footer = Footer[Math.floor(Math.random() * Footer.length)];
            if (Array.isArray(FooterAvatarImage))
                FooterAvatarImage =
                    FooterAvatarImage[Math.floor(Math.random() * FooterAvatarImage.length)];
            // Random Others
            if (Array.isArray(Color))
                Color = Color[Math.floor(Math.random() * Color.length)];
            if (Array.isArray(Image))
                Image = Image[Math.floor(Math.random() * Image.length)];
            if (Array.isArray(Thumbnail))
                Thumbnail =
                    Thumbnail[Math.floor(Math.random() * Thumbnail.length)];

            if (!Title && !Author && !Description && !Fields) {
                embed
                    .setTitle("Error")
                    .setDescription(
                        "Atleast 1 value is requried to build a embed"
                    );
                messageData.embeds.push(embed);
            } else {
                // General
                if (Title) embed.setTitle(Title);
                if (Description) embed.setDescription(Description);
                // Author
                if (Author && AuthorAvatarImage)
                    embed.setAuthor({
                        name: Author,
                        iconURL: AuthorAvatarImage
                    });
                else if (Author) embed.setAuthor({
                    name: Author
                });
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

    if (Components && typeof Components == "object") {
        messageData.components = parseComponents(Components, Variables, false);
    }
    return messageData;
};
