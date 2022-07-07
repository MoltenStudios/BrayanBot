import Utils from '../Utils';
import { MessageActionRow, MessageActionRowComponentResolvable, MessageButton, MessageButtonStyleResolvable, MessageSelectMenu } from 'discord.js';

type Component = {
    Type: string,
    CustomID?: string,
    Disabled?: boolean,

    // Button
    Style?: string,
    Label?: string,
    Emoji?: string,
    Link?: string,

    // Select Menu
    Placeholder?: string,
    MinSelect?: number,
    MaxSelect?: number,
    Options?: {
        Label: string,
        Value: string,
        Description?: string,
        Default?: boolean,
        Emoji?: string
    }[]
}

type SetupComponents = {
    1?: Component[],
    2?: Component[],
    3?: Component[],
    4?: Component[],
    5?: Component[],
}

type Settings = {
    configPath: SetupComponents,
    variables?: {
        searchFor: RegExp,
        replaceWith: any
    }[]
}

/**
 * Create message components from given settings.
 * @param settings Settings with configPath and variables to create message components
 * @returns {MessageActionRow[]}
 */
const setupComponents = (settings: Settings): MessageActionRow[] => {
    const configPath = settings.configPath;
    const variables = settings.variables;
    const components: MessageActionRow[] = [];

    const rows: MessageActionRow[] = [ 
        new MessageActionRow(), new MessageActionRow(), 
        new MessageActionRow(), new MessageActionRow(), new MessageActionRow() 
    ];
    
    for (let [i, value] of Object.entries(configPath)) {
        const row = rows[(parseInt(i) - 1)];
        if(row && value && Array.isArray(value) && value[0]) for (const component of value) {
            const Type = component.Type || null;
            const CustomID = component.CustomID || null;
            const Disabled = component.Disabled || false;

            if(CustomID) switch (Type?.toLowerCase()) {
                case "Button".toLowerCase(): {
                    let Style = component.Style || null;
                    let Label = component.Label || null;
                    let Emoji = component.Emoji || null;
                    let Link = component.Link || null;

                    if(variables && variables[0]) {
                        if(Style && typeof Style === "string") Style = Utils.applyVariables(Style, variables);
                        if(Label && typeof Label === "string") Label = Utils.applyVariables(Label, variables);
                        if(Emoji && typeof Emoji === "string") Emoji = Utils.applyVariables(Emoji, variables);
                        if(Link && typeof Link === "string") Link = Utils.applyVariables(Link, variables);
                    }

                    if(Style && ["blurple", "green", "red", "grey", "url", "link"].includes(Style.toLowerCase())) {
                        switch(Style.toLowerCase()) {
                            case "url":     case "link":        Style = "LINK"; break;
                            case "red":     case "danger":      Style = "DANGER"; break;
                            case "green":   case "success":     Style = "SUCCESS"; break;
                            case "grey":    case "secondary":   Style = "SECONDARY"; break;
                            case "blurple": case "primary":     Style = "PRIMARY"; break;
                            default: Link ? Style = "Link" : Style = "PRIMARY"; break;
                        }
                    }

                    const Button = new MessageButton()
                    if(Link) {
                        Button.setURL(Link).setStyle("LINK")
                        if(Label) Button.setLabel(Label);
                        if(Emoji) Button.setEmoji(Emoji);
                        if(Disabled) Button.setDisabled(Disabled);
                    } else if(CustomID) {
                        Button.setCustomId(CustomID);
                        if(Label) Button.setLabel(Label);
                        if(Emoji) Button.setEmoji(Emoji);
                        if(Disabled) Button.setDisabled(Disabled);
                        if(Style) Button.setStyle(Style as MessageButtonStyleResolvable);
                    }

                    row.addComponents(Button as MessageActionRowComponentResolvable)
                    break;
                }
                case "SelectMenu".toLowerCase(): {
                    let Placeholder = component.Placeholder || null;
                    let MinSelect = component.MinSelect || 0;
                    let MaxSelect = component.MaxSelect || 0;
                    let Options = component.Options || [];

                    if(Options[0]) {
                        if(variables && variables[0]) {
                            if(Placeholder && typeof Placeholder === "string") Placeholder = Utils.applyVariables(Placeholder, variables);
                        }

                        const SelectMenu = new MessageSelectMenu()
                            .setCustomId(CustomID).setDisabled(Disabled)
                            .setMaxValues(MaxSelect).setMinValues(MinSelect)

                        if(Placeholder) SelectMenu.setPlaceholder(Placeholder);

                        SelectMenu.setOptions(Options.map(option => {
                            let Label = option.Label;
                            let Value = option.Value;
                            let Emoji = option.Emoji || null;
                            let Default = option.Default || false;
                            let Description = option.Description || null;

                            let data: {
                                value: string, label: string,
                                default?: boolean, emoji?: string
                                description?: string,
                            } = {
                                value: Value,
                                label: Label,
                            };

                            if (Default) data.default = Default;
                            if(variables && variables[0]) {
                                if(Label && typeof Label === "string") data.label = Utils.applyVariables(Label, variables);
                                if(Value && typeof Value === "string") data.value = Utils.applyVariables(Value, variables);
                                if(Emoji && typeof Emoji === "string") data.emoji = Utils.applyVariables(Emoji, variables);
                                if(Description && typeof Description === "string") data.description = Utils.applyVariables(Description, variables);
                            } else {
                                if (Emoji) data.emoji = Emoji;
                                if (Description) data.description = Description;
                            }

                            return data;
                        }))

                        row.addComponents(SelectMenu as MessageActionRowComponentResolvable)
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