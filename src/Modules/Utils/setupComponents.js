import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle,
    StringSelectMenuBuilder, ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder, UserSelectMenuBuilder, ChannelType
} from 'discord.js';
import Utils from '../Utils.js';

const Component = {
    Type: String,
    CustomID: String,
    Disabled: Boolean,

    // Button
    Style: String | ButtonStyle,
    Label: String,
    Emoji: String,
    Link: String,

    // Select Menu
    Placeholder: String,
    MenuType: "channel" || "role" || "user" || "string",
    ChannelType: ChannelType,
    MinSelect: Number,
    MaxSelect: Number,
    Options: [{
        Label: String,
        Value: String,
        Description: String,
        Default: Boolean,
        Emoji: String
    }]
}

const SetupComponents = {
    1: [Component],
    2: [Component],
    3: [Component],
    4: [Component],
    5: [Component],
}

const Settings = {
    configPath: SetupComponents,
    variables: [{
        searchFor: RegExp,
        replaceWith: String || Number || Boolean
    }]
}

/**
 * Create message components from given settings.
 * @param {Settings} settings Settings with configPath and variables to create message components
 * @returns {ActionRowBuilder[]}
 */
const setupComponents = (settings) => {
    const configPath = settings.configPath;
    const variables = settings.variables;
    const components = [];

    const rows = [
        new ActionRowBuilder(), new ActionRowBuilder(),
        new ActionRowBuilder(), new ActionRowBuilder(), new ActionRowBuilder()
    ];

    for (let [i, value] of Object.entries(configPath)) {
        const row = rows[(parseInt(i) - 1)];
        if (row && value && Array.isArray(value) && value[0]) for (const component of value) {
            const Type = component.Type || null;
            const CustomID = component.CustomID || null;
            const Disabled = component.Disabled || false;

            switch (Type?.toLowerCase()) {
                case "Button".toLowerCase(): {
                    let Style = component.Style || null;
                    let Label = component.Label || null;
                    let Emoji = component.Emoji || null;
                    let Link = component.Link || null;

                    if (variables && variables[0]) {
                        if (Style && typeof Style === "string") Style = Utils.applyVariables(Style, variables);
                        if (Label && typeof Label === "string") Label = Utils.applyVariables(Label, variables);
                        if (Emoji && typeof Emoji === "string") Emoji = Utils.applyVariables(Emoji, variables);
                        if (Link && typeof Link === "string") Link = Utils.applyVariables(Link, variables);
                    }

                    if (Style && typeof Style == "string" && ["blurple", "green", "red", "grey", "url", "link"].includes(Style.toLowerCase())) {
                        switch (Style.toLowerCase()) {
                            case "url": case "link": Style = ButtonStyle.Link; break;
                            case "red": case "danger": Style = ButtonStyle.Danger; break;
                            case "green": case "success": Style = ButtonStyle.Success; break;
                            case "grey": case "secondary": Style = ButtonStyle.Secondary; break;
                            case "blurple": case "primary": Style = ButtonStyle.Primary; break;
                            default: Link ? Style = ButtonStyle.Link : Style = ButtonStyle.Primary; break;
                        }
                    }

                    const Button = new ButtonBuilder()
                    if (Link) {
                        Button.setURL(Link).setStyle(ButtonStyle.Link)
                        if (Label) Button.setLabel(Label);
                        if (Emoji) Button.setEmoji(Emoji);
                        if (Disabled) Button.setDisabled(Disabled);
                    } else if (CustomID) {
                        Button.setCustomId(CustomID);
                        if (Label) Button.setLabel(Label);
                        if (Emoji) Button.setEmoji(Emoji);
                        if (Disabled) Button.setDisabled(Disabled);
                        if (Style) Button.setStyle(Style);
                    }

                    row.addComponents(Button);
                    break;
                }
                case "Select Menu".toLowerCase():
                case "SelectMenu".toLowerCase(): {
                    let MenuType = component.MenuType?.toLowerCase() || "string";
                    let Placeholder = component.Placeholder || null;
                    let MinSelect = component.MinSelect || 0;
                    let MaxSelect = component.MaxSelect || 1;
                    let Options = component.Options || [];

                    if (CustomID && ["channel", "role", "user", "mentionable", "string"].includes(MenuType)) {
                        if (variables && variables[0]) {
                            if (Placeholder && typeof Placeholder === "string") Placeholder = Utils.applyVariables(Placeholder, variables);
                        }
                        const SelectMenu = new (MenuType == "role" ? RoleSelectMenuBuilder : MenuType == "channel" ? ChannelSelectMenuBuilder
                            : MenuType == "user" ? UserSelectMenuBuilder : StringSelectMenuBuilder)();

                        SelectMenu.setCustomId(CustomID).setDisabled(Disabled)
                            .setMaxValues(MaxSelect).setMinValues(MinSelect)

                        if (component.ChannelType) SelectMenu.setChannelTypes([component.ChannelType]);

                        if (Placeholder) SelectMenu.setPlaceholder(Placeholder);

                        if (Options && Options[0]) {
                            SelectMenu?.setOptions(Options.map(option => {
                                let Label = option.Label || null;
                                let Value = option.Value || null;
                                let Emoji = option.Emoji || null;
                                let Default = option.Default || false;
                                let Description = option.Description || null;

                                let data = { value: Value, label: Label, };

                                if (Default) data.default = Default;
                                if (variables && variables[0]) {
                                    if (Label && typeof Label === "string") data.label = Utils.applyVariables(Label, variables);
                                    if (Value && typeof Value === "string") data.value = Utils.applyVariables(Value, variables);
                                    if (Emoji && typeof Emoji === "string") data.emoji = Utils.applyVariables(Emoji, variables);
                                    if (Description && typeof Description === "string") data.description = Utils.applyVariables(Description, variables);
                                } else {
                                    if (Emoji) data.emoji = Emoji;
                                    if (Description) data.description = Description;
                                }

                                return data;
                            }))
                        }

                        row.addComponents(SelectMenu)
                    }

                    break;
                }
            }
        }
    }

    for (const row of rows)
        if (row.components.length > 0 && row.components.length <= 5) components.push(row);

    return components;
}

export { setupComponents, Settings, SetupComponents };