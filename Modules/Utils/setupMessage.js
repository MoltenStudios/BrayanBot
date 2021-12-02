const Discord = require('discord.js'),
    { MessageActionRow, MessageButton, MessageSelectMenu } = Discord,
    Utils = require('../Utils'),
    parseComponents = require('./parseComponents');

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
            }
        ]
    }
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
                URL: String,
                Title: String,
                Description: String,
                Fields: [
                    {
                        Name: String,
                        Value: String,
                        Inline: Boolean
                    }
                ],
                Footer: String,
                FooterIcon: String,
                Thumbnail: String,
                Image: String,
                Color: String,
                Timestamp: Boolean
            }
        ],
        Components: componentsStructure
    },
    variables: [
        { searchFor: RegExp, replaceWith: String }
    ]
};

/**
 * 
 * @param {messageStructure} settings 
 * @param {boolean} ephemeral 
 * @param {componentsStructure} components 
 * @returns 
 */
module.exports = (settings, ephemeral = false, components = null) => {
    let messageData = {
        content: settings.configPath.Content ? settings.configPath.Content : null,
        embeds: settings.configPath.Embeds && Array.isArray(settings.configPath.Embeds) ? [] : null,
        ephemeral: ephemeral ? ephemeral : false,
        components: components ? components : null
    },
        Variables = settings.variables
    if (settings.configPath.Embeds && Array.isArray(settings.configPath.Embeds)) {
        for (let index = 0; index < settings.configPath.Embeds.length; index++) {
            const embedSettings = settings.configPath.Embeds[index];
            let Content = embedSettings.content || embedSettings.Content,
                Title = embedSettings.title || embedSettings.Title,
                Description = embedSettings.description || embedSettings.Description,
                Footer = embedSettings.footer || embedSettings.Footer,
                FooterAvatarImage = embedSettings.footericon || embedSettings.FooterIcon,
                Timestamp = embedSettings.timestamp || embedSettings.Timestamp,
                Thumbnail = embedSettings.thumbnail || embedSettings.Thumbnail,
                Author = embedSettings.author || embedSettings.Author,
                AuthorAvatarImage = embedSettings.authoricon || embedSettings.AuthorIcon,
                Color = embedSettings.color || embedSettings.Color || '2f3136',
                Fields = embedSettings.fields || embedSettings.Fields,
                Image = embedSettings.image || embedSettings.Image,
                URL = embedSettings.url || embedSettings.URL,
                fields = [],
                embed = new Discord.MessageEmbed();

            if (Variables && typeof Variables === 'object') {
                Variables.forEach(variable => {
                    if (Content)
                        Content = Content.replace(variable.searchFor, variable.replaceWith)
                    if (Title)
                        Title = Title.replace(variable.searchFor, variable.replaceWith);
                    if (Description)
                        Description = Description.replace(variable.searchFor, variable.replaceWith);
                    if (Footer)
                        Footer = Footer.replace(variable.searchFor, variable.replaceWith);
                    if (FooterAvatarImage)
                        FooterAvatarImage = FooterAvatarImage.replace(variable.searchFor, variable.replaceWith);
                    if (Thumbnail)
                        Thumbnail = Thumbnail.replace(variable.searchFor, variable.replaceWith);
                    if (Author)
                        Author = Author.replace(variable.searchFor, variable.replaceWith);
                    if (AuthorAvatarImage)
                        AuthorAvatarImage = AuthorAvatarImage.replace(variable.searchFor, variable.replaceWith);
                    if (Image)
                        Image = Image.replace(variable.searchFor, variable.replaceWith);
                    if (URL)
                        URL = URL.replace(variable.searchFor, variable.replaceWith);
                })
            }

            if (Fields) {
                Fields.forEach(async (field, i) => {
                    let data = {
                        name: field.Name,
                        value: field.Value,
                        inline: field.Inline
                    };

                    if (Variables && typeof Variables === 'object') {
                        Variables.forEach((v) => {
                            data.name = data.name.replace(v.searchFor, v.replaceWith);
                            data.value = data.value.replace(v.searchFor, v.replaceWith);
                        });
                    }
                    fields.push(data);
                });
            }

            // Randomised General
            if (Array.isArray(Content))
                Content = Content[Math.floor(Math.random() * Content.length)]
            if (Array.isArray(Title))
                Title = Title[Math.floor(Math.random() * Title.length)]
            if (Array.isArray(Description))
                Description = Description[Math.floor(Math.random() * Description.length)]
            // Randomised Authors
            if (Array.isArray(Author))
                Author = Author[Math.floor(Math.random() * Author.length)]
            if (Array.isArray(AuthorAvatarImage))
                AuthorAvatarImage = AuthorAvatarImage[Math.floor(Math.random() * AuthorAvatarImage.length)]
            // Randomised Footers
            if (Array.isArray(Footer))
                Footer = Footer[Math.floor(Math.random() * Footer.length)]
            if (Array.isArray(FooterAvatarImage))
                FooterAvatarImage = FooterAvatarImage[Math.floor(Math.random() * FooterAvatarImage.length)]
            // Random Others
            if (Array.isArray(Color))
                Color = Color[Math.floor(Math.random() * Color.length)]
            if (Array.isArray(Image))
                Image = Image[Math.floor(Math.random() * Image.length)]
            if (Array.isArray(Thumbnail))
                Thumbnail = Thumbnail[Math.floor(Math.random() * Thumbnail.length)]

            if (!Title && !Author && !Description && !Fields) {
                embed.setTitle('Error')
                    .setDescription('Atleast 1 value is requried to build a embed')
                messageData.embeds.push(embed)
            } else {
                // General
                if (Title) embed.setTitle(Title)
                if (Description) embed.setDescription(Description)
                // Author

                if (Author && AuthorAvatarImage) embed.setAuthor(Author, AuthorAvatarImage)
                else if (Author) embed.setAuthor(Author)

                // Footers
                if (Footer && FooterAvatarImage) embed.setFooter(Footer, FooterAvatarImage)
                else if (Footer) embed.setFooter(Footer)
                // Images
                if (Image) embed.setImage(Image)
                if (Thumbnail) embed.setThumbnail(Thumbnail)
                // Others
                if (Timestamp) embed.setTimestamp()
                if (Color) embed.setColor(Color)
                if (URL) embed.setURL(URL)
                // Fields
                if (Fields && Fields.length) {
                    fields.forEach(field => {
                        embed.addField(field.name, field.value, field.inline)
                    })
                }

                messageData.embeds.push(embed)
            }
        }
    }

    if (settings.configPath.Components && typeof settings.configPath.Components == "object") {
        messageData.components = parseComponents(settings.configPath.Components, Variables, false)
    }
    if (Variables && typeof Variables === 'object') {
        Variables.forEach(variable => {
            if (messageData.content)
                messageData.content = messageData.content.replace(variable.searchFor, variable.replaceWith)
        })
    }
    return messageData;
}