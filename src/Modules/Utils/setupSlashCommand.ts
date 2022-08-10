import { ApplicationCommandOptionType } from "discord.js"

type SlashCommandOption = {
    Type?: string,
    Name?: string,
    Description?: string,
    Required?: Boolean,
    ChannelTypes?: string[],
    Options?: SlashCommandOption[],
    Choices?: {
        Name?: string,
        Value?: any,
    }[]
}

type SetupSlashCommand = {
    Name?: string,
    Description?: string,
    Options?: SlashCommandOption[]
}

type RawSlashCommand = {
    type?: number,
    name?: string,
    description?: string,
    options?: RawSlashCommand[],
    required?: boolean,
    channel_types?: any[]
    choices?: {
        name: string,
        value: any
    }[],
}

const setupSlashCommand = (settings: SetupSlashCommand) => {
    const { Name, Description, Options } = settings;

    if(!Name || !Description) {
        throw new Error('Name and Description are required to build a SlashCommand');
    }

    let slashCMD: RawSlashCommand = {
        name: Name.toLowerCase(),
        description: Description,
    }, optionTypes = [
        "sub command", 1, "sub command group", 2,
        "string", 3, "integer", 4,
        "boolean", 5, "user", 6,
        "channel", 7, "role", 8,
        "mentionable", 9,
    ], channelTypes = [
        "guild_text", 0, "text", "guild_voice", 2, "voice",
        "guild_category", 4, "category", "guild_news", 5, "news",
        "guild_store", 6, "store", "store_thread",
        "guild_news_thread", 10, "news thread", "news_thread",
        "guild_public_thread", 11, "public thread", "public_thread",
        "guild_private_thread", 12, "private thread", "private_thread",
        "guild_stage_voice", 13, "stage channel", "stage voice", "stage_channel", "stage_voice",
    ]

    if(Array.isArray(Options) && Options.length) {
        slashCMD.options = Options.map(option => {
            if(!option.Type) {
                throw new Error('Option Type is required to build a SlashCommand Option');
            } else if(!optionTypes.includes(option.Type.toLowerCase())) {
                throw new Error(`Option Type ${option.Type} is not a valid option type`);
            } else if(!option.Name) {
                throw new Error('Option Name is required to build a SlashCommand Option');
            } else if(!option.Description) {
                throw new Error('Option Description is required to build a SlashCommand Option');
            }

            let parsedOption: RawSlashCommand = {
                name: option.Name.toLowerCase(),
                description: option.Description,
                required: !!option.Required
            }

            if (["sub command", 1].includes(option.Type.toLowerCase())) parsedOption.type = ApplicationCommandOptionType.Subcommand
            else if (["sub command group", 2].includes(option.Type.toLowerCase())) parsedOption.type = ApplicationCommandOptionType.SubcommandGroup
            else if (["string", 3].includes(option.Type.toLowerCase())) parsedOption.type = ApplicationCommandOptionType.String
            else if (["integer", 4].includes(option.Type.toLowerCase())) parsedOption.type = ApplicationCommandOptionType.Integer
            else if (["boolean", 5].includes(option.Type.toLowerCase())) parsedOption.type = ApplicationCommandOptionType.Boolean
            else if (["user", 6].includes(option.Type.toLowerCase())) parsedOption.type = ApplicationCommandOptionType.User
            else if (["channel", 7].includes(option.Type.toLowerCase())) parsedOption.type = ApplicationCommandOptionType.Channel
            else if (["role", 8].includes(option.Type.toLowerCase())) parsedOption.type = ApplicationCommandOptionType.Role
            else if (["mentionable", 9].includes(option.Type.toLowerCase())) parsedOption.type = ApplicationCommandOptionType.Mentionable
            else throw new Error(`Option Type ${option.Type} is not a valid option type`);

            if([1, 2].includes(parsedOption.type)) {
                parsedOption = { type: parsedOption.type, ...setupSlashCommand(option) }
            } else {
                if (option.Choices && Array.isArray(option.Choices) && ["string", 3, "integer", 4, "number", 10].includes(option.Type.toLowerCase())) {
                    parsedOption.choices = option.Choices.map((choice) => {
                        if (!choice.Name) {
                            throw new Error(`A Name is required to build Slash Command's option's choice.`);
                        } else if (!choice.Value) {
                            throw new Error(`A Value is required to build Slash Command's option's choice.`);
                        } else return {
                            name: choice.Name,
                            value: typeof choice.Value == "string" ? choice.Value.toLowerCase() : parseInt(choice.Value),
                        }
                    })  
                }

                if (option.ChannelTypes && Array.isArray(option.ChannelTypes) && ["channel", 7].includes(option.Type.toLowerCase())) {
                    parsedOption.channel_types = option.ChannelTypes.map(channelType => {
                        if (channelTypes.includes(channelType.toLowerCase())) {
                            if (["guild_text", 0, "text"].includes(channelType.toLowerCase())) 
                                return 0
                            else if (["guild_voice", 2, "voice"].includes(channelType.toLowerCase())) 
                                return 2
                            else if (["guild_category", 4, "category"].includes(channelType.toLowerCase())) 
                                return 4
                            else if (["guild_news", 5, "news"].includes(channelType.toLowerCase())) 
                                return 5
                            else if (["guild_store", 6, "store", "store_thread"].includes(channelType.toLowerCase())) 
                                return 6
                            else if (["guild_news_thread", 10, "news thread", "news_thread"].includes(channelType.toLowerCase())) 
                                return 10
                            else if (["guild_public_thread", 11, "public thread", "public_thread"].includes(channelType.toLowerCase())) 
                                return 11
                            else if (["guild_private_thread", 12, "private thread", "private_thread"].includes(channelType.toLowerCase())) 
                                return 12
                            else if (["guild_stage_voice", 13, "stage channel", "stage voice", "stage_channel", "stage_voice"].includes(channelType.toLowerCase())) 
                                return 13
                            else throw new Error(`Channel Type ${channelType} is not a valid channel type`);
                        }
                    })
                }
            }
            
            return parsedOption;
        })
    } else slashCMD.options = [];

    return slashCMD;
}

export { setupSlashCommand, RawSlashCommand, SetupSlashCommand, SlashCommandOption }