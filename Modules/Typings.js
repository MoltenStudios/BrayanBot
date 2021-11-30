const Discord = require('discord.js')


module.export = {
    rowStructure: [
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
    ],
    components: {
        1: module.exports.rowStructure,
        2: module.exports.rowStructure,
        3: module.exports.rowStructure,
        4: module.exports.rowStructure,
        5: module.exports.rowStructure,
    },
    setupMessage: {
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
            ]
        },
        variables: [
            { searchFor: RegExp, replaceWith: String }
        ]
    }
}