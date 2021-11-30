const Discord = require('discord.js'),
    chalk = require('chalk'),
    moment = require('moment'),
    { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js'),
    embedSettingsStructure = {
        configPath: Object,
        variables: [
            { searchFor: RegExp, replaceWith: String }
        ]
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
    };

module.exports = {
    builder: require('@discordjs/builders'),
    wait: require('util').promisify(setTimeout),
    /**
     * 
     * @param {String} text 
     */
    logInfo: (text) => {
        console.log(chalk.hex("#57ff6b").bold("[INFO] ") + text)
    },
    /**
     * 
     * @param {String} text 
     */
    logWarning: (text) => {
        console.log(chalk.hex("#edd100").bold("[WARN] ") + text)
    },
    /**
     * 
     * @param {String} text 
     */
    logError: (text) => {
        console.log(chalk.hex("#ff0800").bold("[ERROR] ") + text)
    },
    /**
     * 
     * @param {Number} max 
     * @returns 
     */
    getRandom: (max) => {
        return (Math.floor(Math.random() * Math.floor(max)))
    },
    /**
     * 
     * @param {String} text 
     * @returns 
     */
    formatFirstLetter: (text) => {
        return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
    },
    /**
     * 
     * @param {String} name 
     * @param {Discord.Guild} guild 
     * @param {String} type 
     * @param {Boolean} notify 
     * @returns 
     */
    findChannel: (name, guild, type = 'GUILD_TEXT', notify = true) => {
        let channel = guild.channels.cache.find(c => (c.name.toLowerCase() == name.toLowerCase() || c.id == name) && c.type.toLowerCase() == type.toLowerCase());
        if (!channel) {
            if (notify) module.exports.logError(`${name} ${type} was not found in the ${guild.name} guild`);
            channel = false;
        }
        return channel;
    },
    /**
     * @param {String} name 
     * @param {Discord.TextChannel} guild 
     * @param {Boolean} notify 
     * @returns {Discord.Role}
     */
    findRole: (name, guild, notify = true) => {
        let role = guild.roles.cache.find(r => r.name.toLowerCase() == name.toLowerCase() || r.id == name);
        if (!role) {
            if (notify) return module.exports.logError(`${name} role was not found in the ${guild.name} guild`);
        }
        return role;
    },
    /**
     * 
     * @param {Discord.GuildMember} member 
     * @param {String} name 
     * @param {Boolean} notify 
     * @returns {Boolean}
     */
    hasRole: (member, name, notify = true) => {
        let role = module.exports.findRole(name, member.guild, notify)
        return (role ? (member.roles.cache.has(role.id) ? true : false) : false)
    },
    /**
     * 
     * @param {messageStructure} settings 
     * @param {Boolean} ephemeral 
     * @param {Array} components 
     * @returns 
     */
    setupMessage: (settings, ephemeral = false, components = null) => {
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
        if (Variables && typeof Variables === 'object') {
            Variables.forEach(variable => {
                if (messageData.content)
                    messageData.content = messageData.content.replace(variable.searchFor, variable.replaceWith)
            })
        }
        return messageData;
    },
    /**
     * 
     * @param {Discord.GuildMember} user 
     * @param {String} prefix 
     * @returns {Array}
     */
    userVariables: (user, prefix) => {
        return [
            { searchFor: new RegExp(`{${prefix || "user"}-id}`, 'g'), replaceWith: user.id },
            { searchFor: new RegExp(`{${prefix || "user"}-displayname}`, 'g'), replaceWith: user.displayName },
            { searchFor: new RegExp(`{${prefix || "user"}-username}`, 'g'), replaceWith: user.user.username },
            { searchFor: new RegExp(`{${prefix || "user"}-tag}`, 'g'), replaceWith: user.user.tag },
            { searchFor: new RegExp(`{${prefix || "user"}-mention}`, 'g'), replaceWith: '<@' + user.id + '>' },
            { searchFor: new RegExp(`{${prefix || "user"}-pfp}`, 'g'), replaceWith: user.user.displayAvatarURL({ dynamic: true }) },
            { searchFor: new RegExp(`{${prefix || "user"}-createdat}`, 'g'), replaceWith: moment(user.user.createdAt).format("MMMM Do YYYY, h:mm a") },
        ]
    },
    /**
     * 
     * @param {Discord.Client} bot 
     * @param {String} prefix 
     * @returns {Array}
     */
    botVariables: (bot, prefix) => {
        return [
            { searchFor: new RegExp(`{${prefix || "bot"}-id}`, 'g'), replaceWith: bot.id },
            { searchFor: new RegExp(`{${prefix || "bot"}-displayname}`, 'g'), replaceWith: bot.displayName },
            { searchFor: new RegExp(`{${prefix || "bot"}-username}`, 'g'), replaceWith: bot.user.username },
            { searchFor: new RegExp(`{${prefix || "bot"}-tag}`, 'g'), replaceWith: bot.user.tag },
            { searchFor: new RegExp(`{${prefix || "bot"}-mention}`, 'g'), replaceWith: '<@' + bot.id + '>' },
            { searchFor: new RegExp(`{${prefix || "bot"}-pfp}`, 'g'), replaceWith: bot.user.displayAvatarURL({ dynamic: true }) },
        ]
    },
    /**
     * 
     * @param {Object} buttonOptions 
     * @param {String} customID 
     * @returns {Discord.MessageButton}
     */
    parseComponents: (components, isDisabled) => {
        let validButtonStyles = [
            "primary", "secondary", "success", "danger", "link",
            "blurple", "grey", "green", "red", "url",
            1, 2, 3, 4, 5, "1", "2", "3", "4", "5"
        ],
            colors = ["PRIMARY", "SECONDARY", "SUCCESS", "DANGER"],
            rows = {
                1: new MessageActionRow(),
                2: new MessageActionRow(),
                3: new MessageActionRow(),
                4: new MessageActionRow(),
                5: new MessageActionRow()
            }, i, y;

        for (i = 1; i <= 5; i++) {
            let rowComponents = components[i]
            if (rowComponents) {
                for (y = 0; y < rowComponents.length; y++) {
                    const component = rowComponents[y];

                    if (component.Type) {
                        switch (component.Type.toLowerCase()) {
                            case "button": {
                                if (component.Style.toLowerCase() == "random" || validButtonStyles.includes(component.Style.toLowerCase())) {
                                    if (component.Style.toLowerCase() == "link") {
                                        if (!component.Link) {
                                            module.exports.logError(`A link is required for button to work.`)
                                        } else if (!component.Label && !component.Emoji) {
                                            module.exports.logError(`Label or Emoji is required for button to work.`)
                                        } else {
                                            let button = new MessageButton()
                                                .setStyle("LINK")
                                                .setURL(component.Link || component.URL)
                                            if (component.Label) button.setLabel(component.Label)
                                            if (component.Emoji) button.setEmoji(component.Emoji)
                                            if (isDisabled) button.setDisabled(true)
                                            rows[i].addComponents([button])
                                        }
                                    } else {
                                        if (!component.CustomID) {
                                            module.exports.logError(`CustomID is required for button to work.`)
                                        } else if (!component.Label && !component.Emoji) {
                                            module.exports.logError(`Label or Emoji is required for button to work.`)
                                        } else {
                                            let button = new MessageButton()
                                                .setCustomId(component.CustomID);
                                            if (component.Style.toLowerCase() == "random") {
                                                button.setStyle(colors[Math.floor((Math.random() * colors.length))])
                                            } else if (["primary", "blurple", 1, "1"].includes(component.Style.toLowerCase())) {
                                                button.setStyle("PRIMARY")
                                            } else if (["secondary", "grey", 2, "2"].includes(component.Style.toLowerCase())) {
                                                button.setStyle("SECONDARY")
                                            } else if (["success", "green", 3, "3"].includes(component.Style.toLowerCase())) {
                                                button.setStyle("SUCCESS")
                                            } else if (["danger", "red", 4, "4"].includes(component.Style.toLowerCase())) {
                                                button.setStyle("DANGER")
                                            }
                                            if (component.Label) button.setLabel(component.Label)
                                            if (component.Emoji) button.setEmoji(component.Emoji)
                                            if (isDisabled) button.setDisabled(true)
                                            rows[i].addComponents([button])
                                        }
                                    }
                                } else {
                                    module.exports.logError(`Invalid Button Style: ${component.Style}`)
                                }
                                break;
                            }
                            case 'selectmenu': {
                                if (!component.CustomID) {
                                    module.exports.logError(`CustomID is required for SelectMenu to work.`)
                                } else if (!Array.isArray(component.Options) || component.Options > 0) {
                                    module.exports.logError(`SelectMenu atleast needs 1 option to work.`)
                                } else {
                                    if (!component.MaxSelect) component.MaxSelect = 0
                                    if (!component.MinSelect) component.MinSelect = 0
                                    let menu = new MessageSelectMenu()
                                        .setCustomId(component.CustomID)
                                        .addOptions(component.Options.map(x => {
                                            let data = { value: x.Value }
                                            if (x.Default) data.default = x.Default
                                            if (x.Label) data.label = x.Label
                                            if (x.Description) data.description = x.Description
                                            if (x.Emoji) data.emoji = x.Emoji
                                            return data;
                                        }))
                                    if (component.Placeholder) menu.setPlaceholder(component.Placeholder)
                                    if (component.MaxSelect) menu.setMaxValues(component.MaxSelect)
                                    if (component.MinSelect) menu.setMinValues(component.MinSelect)
                                    if (isDisabled) menu.setDisabled(true)
                                    rows[i].addComponents([menu])
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

        let finalComponents = []
        for (let x = 1; x <= 5; x++) {
            if (rows[x].components.length > 0 && rows[x].components.length <= 5) {
                finalComponents.push(rows[x])
            }
        }
        return finalComponents;

    },
    /**
     * 
     * @param {String} argument 
     * @param {Discord.Guild} guild 
     * @returns {Discord.GuildMember}
     */
    parseUser: (argument, guild) => {
        if (argument && guild) {
            const user = guild.members.cache.find(user => {
                if (user.user.id.toLowerCase() == argument.toLowerCase()) {
                    return true;
                } else if (user.user.username.toLowerCase() == argument.toLowerCase()) {
                    return true;
                } else if (user.user.tag.toLowerCase() == argument.toLowerCase()) {
                    return true;
                } else if (user.displayName && user.displayName.toLowerCase() == argument.toLowerCase()) {
                    return true
                }
            })
            if (user) {
                return user;
            } else {
                return false;
            }
        } else return false
    },
    /**
     * 
     * @param {Discord.Message} message 
     * @param {String} argument 
     */
    parseUserFromMessage: (message, argument, messageMember = true) => {
        if (messageMember) {
            return message.mentions.members.first() || module.exports.parseUser(argument, message.guild) || message.member
        } else {
            return message.mentions.members.first() || module.exports.parseUser(argument, message.guild)
        }

    }
}