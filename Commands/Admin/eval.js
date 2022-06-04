const Utils = require("../../Modules/Utils"),
  { lang, config, commands } = require("../../index"),
moment = require("moment");

module.exports = {
  name: "eval",
  type: "admin",
  commandData: commands.Admin.Eval,
};

/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Message} message
 * @param {Array} args
 */
module.exports.run = async (bot, message, args) => {
  // Define code to eval
  const input = args.join(" ");
  // Send error message if code is empty
  if (!input)
    return message.reply(
      Utils.setupMessage({
        configPath: lang.Presets.Error,
        variables: [
          {
            searchFor: /{error}/g,
            replaceWith: "You need to define code, which should be executed!",
          },
          ...Utils.userVariables(message.member),
          ...Utils.botVariables(bot),
        ],
      })
    );
  // Send error message if input includes bot.token
  if (input.includes("token"))
    return message.reply(
      Utils.setupMessage({
        configPath: lang.Presets.Error,
        variables: [
          {
            searchFor: /{error}/g,
            replaceWith: "You can't execute code, which includes bot token!",
          },
          ...Utils.userVariables(message.member),
          ...Utils.botVariables(bot),
        ],
      })
    );
  // Try to execute code
  let clr;
  let rawOutput;
  try {
    rawOutput = await eval(input);
    var output = `\`\`\`js\n${rawOutput}\n\`\`\``;
    clr = "#3c70dc";
  } catch (e) {
    rawOutput = e;
    var output = `\`\`\`js\n${rawOutput}\n\`\`\``;
    
    clr = "RED";
  }
  // Send error message if output includes token
  if (typeof output != "map" && output.toString().includes(bot.token))
    return message.reply(
      Utils.setupMessage({
        configPath: lang.Presets.Error,
        variables: [
          {
            searchFor: /{error}/g,
            replaceWith: "You can't execute code, which includes bot token!",
          },
          ...Utils.userVariables(message.member),
          ...Utils.botVariables(bot),
        ],
      })
    );
  if (output.length > 1024) {
    const output_link = await Utils.paste(rawOutput, "https://paste.zorino.in")
    message.reply(
      Utils.setupMessage({
        configPath: lang.Admin.Eval,
        variables: [
          { searchFor: /{input}/g, replaceWith: input },
          { searchFor: /{output}/g, replaceWith: output_link },
          { searchFor: /{color}/g, replaceWith: clr },
          ...Utils.userVariables(message.member),
          ...Utils.botVariables(bot),
        ],
      })
    );
    return;
  }

  // Send message with eval output
  message.reply(
    Utils.setupMessage({
      configPath: lang.Admin.Eval,
      variables: [
        { searchFor: /{input}/g, replaceWith: input },
        { searchFor: /{output}/g, replaceWith: output },
        { searchFor: /{color}/g, replaceWith: clr },
        ...Utils.userVariables(message.member),
        ...Utils.botVariables(bot),
      ],
    })
  );
};
/**
 *
 * @param {Discord.Client} bot
 * @param {Discord.Interaction} interaction
 */
module.exports.runSlash = async (bot, interaction) => {
  // Define code to eval
  const input = interaction.options.getString("code");
  // Send error message if code is empty
  if (!input)
    return interaction.reply(
      Utils.setupMessage({
        configPath: lang.Presets.Error,
        variables: [
          {
            searchFor: /{error}/g,
            replaceWith: "You need to define code, which should be executed!",
          },
          ...Utils.userVariables(interaction.member),
          ...Utils.botVariables(bot),
        ],
      })
    );
  // Send error message if input includes bot.token
  if (input.includes("bot.token"))
    return interaction.reply(
      Utils.setupMessage({
        configPath: lang.Presets.Error,
        variables: [
          {
            searchFor: /{error}/g,
            replaceWith: "You can't execute code, which includes bot token!",
          },
          ...Utils.userVariables(interaction.member),
          ...Utils.botVariables(bot),
        ],
      })
    );
  // Try to execute code
  let clr;
  let rawOutput;
  try {
    rawOutput = await eval(input);
    var output = `\`\`\`js\n${rawOutput}\n\`\`\``;
    clr = "#3c70dc";
  } catch (e) {
    rawOutput = e;
    var output = `\`\`\`js\n${rawOutput}\n\`\`\``;
    
    clr = "RED";
  }
  // Send error message if output includes token
  if (typeof output != "map" && output.toString().includes(bot.token))
    return interaction.reply(
      Utils.setupMessage({
        configPath: lang.Presets.Error,
        variables: [
          {
            searchFor: /{error}/g,
            replaceWith: "You can't execute code, which includes bot token!",
          },
          ...Utils.userVariables(interaction.member),
          ...Utils.botVariables(bot),
        ],
      })
    );
  if (output.length > 1024) {
    const output_link = await Utils.paste(rawOutput, "https://paste.zorino.in")
    interaction.reply(
      Utils.setupMessage({
        configPath: lang.Admin.Eval,
        variables: [
          { searchFor: /{input}/g, replaceWith: input },
          { searchFor: /{output}/g, replaceWith: output_link },
          { searchFor: /{color}/g, replaceWith: clr },
          ...Utils.userVariables(interaction.member),
          ...Utils.botVariables(bot),
        ],
      })
    );
    return;
  }
  // Send message with eval output
  interaction.reply(
    Utils.setupMessage({
      configPath: lang.Admin.Eval,
      variables: [
        { searchFor: /{input}/g, replaceWith: input },
        { searchFor: /{output}/g, replaceWith: output },
        { searchFor: /{color}/g, replaceWith: clr },
        ...Utils.userVariables(interaction.member),
        ...Utils.botVariables(bot),
      ],
    })
  );
};
