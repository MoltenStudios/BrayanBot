import Utils from '../Utils';
import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { manager } from '../..';

type SetupEmbed = {
    Type?: "rich" | "image" | "video" | "gifv" | "article" | "link",
    Author?: string | string[],
    AuthorIcon?: string | string[],
    AuthorURL?: string | string[],
    URL?: string | string[],
    Title?: string | string[],
    Description?: string | string[],
    Fields?: string | {
        Name: string,
        Value: string,
        Inline?: Boolean,
    }[],
    Footer?: string | string[],
    FooterIcon?: string | string[],
    Thumbnail?: string | string[],
    Image?: string | string[],
    Color?: string | string[],
    Timestamp?: number | string | Boolean,
}

type Settings = {
    configPath: SetupEmbed,
    variables?: {
        searchFor: RegExp,
        replaceWith: any
    }[]
}

/**
 * Create an Embed from given settings.
 * @param settings Settings with configPath and variables to create embed
 * @returns {EmbedBuilder}
 */
const setupEmbed = (settings: Settings): EmbedBuilder => {
    const configPath = settings.configPath;
    const variables = settings.variables;

    let Author = configPath.Author || null;
    let AuthorIcon = configPath.AuthorIcon || null;
    let AuthorURL = configPath.AuthorURL || null;
    let URL = configPath.URL || null;
    let Title = configPath.Title || null;
    let Description = configPath.Description || null;
    let Fields = configPath.Fields || null;
    let Footer = configPath.Footer || null;
    let FooterIcon = configPath.FooterIcon || null;
    let Thumbnail = configPath.Thumbnail || null;
    let Image = configPath.Image || null;
    let Timestamp = configPath.Timestamp || null;
    let Color = configPath.Color || manager.configs.config?.Branding.Color || null;

    // Get random if array
    if (Array.isArray(Author)) Author = Utils.getRandom(Author);
    if (Array.isArray(AuthorIcon)) AuthorIcon = Utils.getRandom(AuthorIcon);
    if (Array.isArray(AuthorURL)) AuthorURL = Utils.getRandom(AuthorURL);
    if (Array.isArray(URL)) URL = Utils.getRandom(URL);
    if (Array.isArray(Title)) Title = Utils.getRandom(Title);
    if (Array.isArray(Description)) Description = Utils.getRandom(Description);
    if (Array.isArray(Footer)) Footer = Utils.getRandom(Footer);
    if (Array.isArray(FooterIcon)) FooterIcon = Utils.getRandom(FooterIcon);
    if (Array.isArray(Thumbnail)) Thumbnail = Utils.getRandom(Thumbnail);
    if (Array.isArray(Image)) Image = Utils.getRandom(Image);
    if (Array.isArray(Color)) Color = Utils.getRandom(Color);

    // Apply variables
    if (Array.isArray(variables) && variables.length > 0) {
        if (Author && typeof Author == "string") Author = Utils.applyVariables(Author, variables);
        if (AuthorIcon && typeof AuthorIcon == "string") AuthorIcon = Utils.applyVariables(AuthorIcon, variables);
        if (AuthorURL && typeof AuthorURL == "string") AuthorURL = Utils.applyVariables(AuthorURL, variables);
        if (URL && typeof URL == "string") URL = Utils.applyVariables(URL, variables);
        if (Title && typeof Title == "string") Title = Utils.applyVariables(Title, variables);
        if (Description && typeof Description == "string") Description = Utils.applyVariables(Description, variables);
        if (Footer && typeof Footer == "string") Footer = Utils.applyVariables(Footer, variables);
        if (FooterIcon && typeof FooterIcon == "string") FooterIcon = Utils.applyVariables(FooterIcon, variables);
        if (Thumbnail && typeof Thumbnail == "string") Thumbnail = Utils.applyVariables(Thumbnail, variables);
        if (Image && typeof Image == "string") Image = Utils.applyVariables(Image, variables);
        if (Color && typeof Color == "string") Color = Utils.applyVariables(Color, variables);
        if (Timestamp && typeof Timestamp == "string") Timestamp = Utils.applyVariables(Timestamp, variables);
        if (Fields && typeof Fields == "string") Fields = Utils.applyVariables(Fields, variables);

        if (Array.isArray(Fields) && Fields.length > 0) {
            for (let i = 0; i < Fields.length; i++) {
                if (Fields[i].Name && typeof Fields[i].Name == "string") Fields[i].Name = Utils.applyVariables(Fields[i].Name, variables);
                if (Fields[i].Value && typeof Fields[i].Value == "string") Fields[i].Value = Utils.applyVariables(Fields[i].Value, variables);
            }
        }
    }

    // Create embed
    if (!Author && !AuthorIcon && !AuthorURL && !URL && !Title && !Description && !Footer && !FooterIcon &&
        !Thumbnail && !Image && !Color && !Timestamp && !Fields) throw new Error("No Embed Properties were found.")

    const Embed = new EmbedBuilder();

    if (Title) Embed.setTitle(Title as string);
    if (Description) Embed.setDescription(Description as string);
    if (URL) Embed.setURL(URL as string);
    if (Thumbnail) Embed.setThumbnail(Thumbnail as string);
    if (Image) Embed.setImage(Image as string);
    if (Color) Embed.setColor(Color as ColorResolvable);
    if (Timestamp) Embed.setTimestamp(Date.now());

    if(Author && AuthorIcon && AuthorURL) {
        Embed.setAuthor({name: Author as string, iconURL: AuthorIcon as string, url: AuthorURL as string });
    } else if(Author && AuthorIcon) {
        Embed.setAuthor({ name: Author as string, iconURL: AuthorIcon as string });
    } else if(Author && AuthorURL) {
        Embed.setAuthor({ name: Author as string, url: AuthorURL as string });
    } else if(Author) {
        Embed.setAuthor({ name: Author as string });
    }

    if(Footer && FooterIcon) {
        Embed.setFooter({ text: Footer as string, iconURL: FooterIcon as string })
    } else if(Footer) {
        Embed.setFooter({ text: Footer as string });
    }

    if (Array.isArray(Fields) && Fields.length > 0) {
        for (let y = 0; y < Fields.length; y++) {
            if(Fields[y].Name && Fields[y].Value) 
                Embed.addFields({
                    name: Fields[y].Name as string,
                    value: Fields[y].Value as string,
                    inline: !!Fields[y].Inline
                });
        }
    }

    return Embed;
}

export { setupEmbed, Settings, SetupEmbed };