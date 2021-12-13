const Discord = require("discord.js"),
    { MessageActionRow, MessageButton, MessageSelectMenu } = Discord,
    Utils = require("../Utils");

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
    variablesStructure = [{ searchFor: RegExp, replaceWith: String }];
/**
 *
 * @param {componentsStructure} components
 * @param {variablesStructure} variables
 * @param {Boolean} isDisabled
 * @returns
 */
module.exports = (components, variables, isDisabled) => {
    let validButtonStyles = [
            "primary",
            "secondary",
            "success",
            "danger",
            "link",
            "blurple",
            "grey",
            "green",
            "red",
            "url",
            1,
            2,
            3,
            4,
            5,
            "1",
            "2",
            "3",
            "4",
            "5",
        ],
        colors = ["PRIMARY", "SECONDARY", "SUCCESS", "DANGER"],
        rows = {
            1: new MessageActionRow(),
            2: new MessageActionRow(),
            3: new MessageActionRow(),
            4: new MessageActionRow(),
            5: new MessageActionRow(),
        },
        i,
        y;
    for (i = 1; i <= 5; i++) {
        let rowComponents = components[i];
        if (rowComponents) {
            for (y = 0; y < rowComponents.length; y++) {
                const component = rowComponents[y];

                // Variables
                if (variables && Array.isArray(variables) && variables[0]) {
                    variables.forEach((variable, i) => {
                        if (component.Label)
                            component.Label = component.Label.replace(
                                variable.searchFor,
                                variable.replaceWith
                            );
                        if (component.Emoji)
                            component.Emoji = component.Emoji.replace(
                                variable.searchFor,
                                variable.replaceWith
                            );
                        if (component.Link)
                            component.Link = component.Link.replace(
                                variable.searchFor,
                                variable.replaceWith
                            );
                        if (component.CustomID)
                            component.CustomID = component.CustomID.replace(
                                variable.searchFor,
                                variable.replaceWith
                            );
                        if (component.Style)
                            component.Style = component.Style.replace(
                                variable.searchFor,
                                variable.replaceWith
                            );
                        if (component.Placeholder)
                            component.Placeholder =
                                component.Placeholder.replace(
                                    variable.searchFor,
                                    variable.replaceWith
                                );
                        if (component.Options) {
                            component.Options.forEach((options, i) => {
                                if (options.Value)
                                    options.Value = options.Value.replace(
                                        variable.searchFor,
                                        variable.replaceWith
                                    );
                                if (options.Label)
                                    options.Label = options.Label.replace(
                                        variable.searchFor,
                                        variable.replaceWith
                                    );
                                if (options.Description)
                                    options.Description =
                                        options.Description.replace(
                                            variable.searchFor,
                                            variable.replaceWith
                                        );
                                if (options.Emoji)
                                    options.Emoji = options.Emoji.replace(
                                        variable.searchFor,
                                        variable.replaceWith
                                    );
                            });
                        }
                    });
                }

                if (component.Type) {
                    switch (component.Type.toLowerCase()) {
                        case "button": {
                            if (
                                component.Style.toLowerCase() == "random" ||
                                validButtonStyles.includes(
                                    component.Style.toLowerCase()
                                )
                            ) {
                                if (component.Style.toLowerCase() == "link") {
                                    if (!component.Link) {
                                        Utils.logError(
                                            `[Utils] [parseComponents] A link is required for button to work.`
                                        );
                                    } else if (
                                        !component.Label &&
                                        !component.Emoji
                                    ) {
                                        Utils.logError(
                                            `[Utils] [parseComponents] Label or Emoji is required for button to work.`
                                        );
                                    } else {
                                        let button = new MessageButton()
                                            .setStyle("LINK")
                                            .setURL(
                                                component.Link || component.URL
                                            );
                                        if (component.Label)
                                            button.setLabel(component.Label);
                                        if (component.Emoji)
                                            button.setEmoji(component.Emoji);
                                        if (isDisabled)
                                            button.setDisabled(true);
                                        rows[i].addComponents([button]);
                                    }
                                } else {
                                    if (!component.CustomID) {
                                        Utils.logError(
                                            `[Utils] [parseComponents] CustomID is required for button to work.`
                                        );
                                    } else if (
                                        !component.Label &&
                                        !component.Emoji
                                    ) {
                                        Utils.logError(
                                            `[Utils] [parseComponents]Label or Emoji is required for button to work.`
                                        );
                                    } else {
                                        let button =
                                            new MessageButton().setCustomId(
                                                component.CustomID
                                            );
                                        if (
                                            component.Style.toLowerCase() ==
                                            "random"
                                        ) {
                                            button.setStyle(
                                                colors[
                                                    Math.floor(
                                                        Math.random() *
                                                            colors.length
                                                    )
                                                ]
                                            );
                                        } else if (
                                            [
                                                "primary",
                                                "blurple",
                                                1,
                                                "1",
                                            ].includes(
                                                component.Style.toLowerCase()
                                            )
                                        ) {
                                            button.setStyle("PRIMARY");
                                        } else if (
                                            [
                                                "secondary",
                                                "grey",
                                                2,
                                                "2",
                                            ].includes(
                                                component.Style.toLowerCase()
                                            )
                                        ) {
                                            button.setStyle("SECONDARY");
                                        } else if (
                                            [
                                                "success",
                                                "green",
                                                3,
                                                "3",
                                            ].includes(
                                                component.Style.toLowerCase()
                                            )
                                        ) {
                                            button.setStyle("SUCCESS");
                                        } else if (
                                            ["danger", "red", 4, "4"].includes(
                                                component.Style.toLowerCase()
                                            )
                                        ) {
                                            button.setStyle("DANGER");
                                        }
                                        if (component.Label)
                                            button.setLabel(component.Label);
                                        if (component.Emoji)
                                            button.setEmoji(component.Emoji);
                                        if (isDisabled)
                                            button.setDisabled(true);
                                        rows[i].addComponents([button]);
                                    }
                                }
                            } else {
                                Utils.logError(
                                    `[Utils] [parseComponents] Invalid Button Style: ${component.Style}`
                                );
                            }
                            break;
                        }
                        case "selectmenu": {
                            if (!component.CustomID) {
                                Utils.logError(
                                    `[Utils] [parseComponents] CustomID is required for SelectMenu to work.`
                                );
                            } else if (
                                !Array.isArray(component.Options) ||
                                component.Options > 0
                            ) {
                                Utils.logError(
                                    `[Utils] [parseComponents] SelectMenu atleast needs 1 option to work.`
                                );
                            } else {
                                if (!component.MaxSelect)
                                    component.MaxSelect = 0;
                                if (!component.MinSelect)
                                    component.MinSelect = 0;
                                let menu = new MessageSelectMenu()
                                    .setCustomId(component.CustomID)
                                    .addOptions(
                                        component.Options.map((x) => {
                                            let data = { value: x.Value };
                                            if (x.Default)
                                                data.default = x.Default;
                                            if (x.Label) data.label = x.Label;
                                            if (x.Description)
                                                data.description =
                                                    x.Description;
                                            if (x.Emoji) data.emoji = x.Emoji;
                                            return data;
                                        })
                                    );
                                if (component.Placeholder)
                                    menu.setPlaceholder(component.Placeholder);
                                if (component.MaxSelect)
                                    menu.setMaxValues(component.MaxSelect);
                                if (component.MinSelect)
                                    menu.setMinValues(component.MinSelect);
                                if (isDisabled) menu.setDisabled(true);
                                rows[i].addComponents([menu]);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    let finalComponents = [];
    for (let x = 1; x <= 5; x++) {
        if (rows[x].components.length > 0 && rows[x].components.length <= 5) {
            finalComponents.push(rows[x]);
        }
    }
    return finalComponents;
};
