// Default configuration
const config =
{
	"Settings": {
		"Token": "BOT-TOKEN",
		"Prefix": "-",
		"ServerID": "YOUR-SERVER-ID",
		"Storage": "database.db",
		"MultiGuild": false,
		"DevMode": false
	},
	"Embeds": {
		"Branding": "Brayan Bot",
		"Color": "2f3136"
	}
}

function getConfirmSchema(description) {
	return {
		properties: {
			confirm: {
				description,
				type: 'string',
				pattern: /^[y|n]/gim,
				message: 'Must respond with either \'y\' or \'n\'',
				required: true,
				before: (value) => value.toLowerCase().startsWith('y')
			}
		}
	};
}

// If directly called on the command line, run setup script
function doSetup() {
	const path = (...paths) => require('path').join(process.cwd(), ...paths);
	const TLog = require('@tycrek/log');
	const fsExtra = require('fs-extra');
	const prompt = require('prompt');

	const log = new TLog({ level: 'debug', timestamp: { enabled: false } });

	// Override default configs with existing configs to allow migrating configs
	// Disabled for now. Wİll find a better way to do it.
	// try {
	//	const existingConfig = require('../config.json');
	//	Object.entries(existingConfig).forEach(([key, value]) => {
	//		Object.prototype.hasOwnProperty.call(config, key) && (config[key] = value); // skipcq: JS-0093
	//	});
	//} catch (ex) {
	//	if (ex.code !== 'MODULE_NOT_FOUND' && !ex.toString().includes('Unexpected end')) log.error(ex);
	//}

	// Disabled the annoying "prompt: " prefix and removes colours
	prompt.message = '';
	prompt.colors = false;
	prompt.start();

	// Schema for config setup
	const setupSchema = {
		properties: {
			botToken: {
				description: 'Your Discord Bot Token',
				type: 'string',
				default: config.Settings.Token,
				required: true,
				message: 'You must input a valid Bot Token'
			},
			prefix: {
				description: 'Your Bot Prefix',
				type: 'string',
				default: config.Settings.Prefix,
				//	pattern: /^[-_!]$/gim, // regex to limit prefix options
				//	message: 'Must be a - , _ , or !'
				required: false,
			},
			serverId: {
				description: `Your Server ID.`,
				type: 'integer',
				default: config.Settings.ServerID,
				required: true,
				message: 'You must input a valid server ID.'
			},
			storage: {
				description: `Name of your storage file. (Example: ${config.Settings.Storage})`,
				type: 'string',
				default: config.Settings.Storage,
				// pattern: ^.*\.(db)$,
				require: false,
			},
			multiGuild: {
				description: 'Would you like to enable Multi Guild support? (Not recommended)',
				type: 'boolean',
				default: config.Settings.MultiGuild,
				require: false,
			},
			branding: {
				description: `The name that will show up on the embed footer. (Example: ${config.Embeds.Branding})`,
				type: 'string',
				default: config.Embeds.Branding,
				required: false
			},
			color: {
				description: `Color for your embeds. (Example: ${config.Embeds.Color})`,
				type: 'string',
				default: config.Embeds.Color,
				required: false
			}
		}
	};

	// Schema for confirm prompt. User must enter 'y' or 'n' (case-insensitive)
	const confirmPrompt = getConfirmSchema('\nIs the above information correct? (y/n)');

	log.blank().blank().blank().blank()
		.info('[=== BrayanBot Setup ===]').blank();
	let results = {};
	prompt.get(setupSchema)
		.then((r) => results = r) // skipcq: JS-0086

		// Verify information is correct
		.then(() => log
			.blank()
			.info('Please verify your information', '\n'.concat(Object.entries(results).map(([setting, value]) => `${'            '}${log.chalk.dim.gray('-->')} ${log.chalk.bold.white(`${setting}:`)} ${log.chalk.white(value)}`).join('\n')))
			.blank())

		// Confirm
		.then(() => prompt.get(confirmPrompt))
		.then(({ confirm }) => (confirm ? fsExtra.writeJson(path('config.json'), results, { spaces: 4 }) : log.error('Setup aborted').callback(process.exit, 1)))

		// Complete & exit
		.then(() => log.blank().success('Setup complete').callback(() => process.exit(0)))
		.catch((err) => log.blank().error(err).callback(() => process.exit(1)));

}

module.exports = {
	doSetup,
	config
};

// If called on the command line, run the setup.
// Using this makes sure setup is not run when imported by another file
if (require.main === module) {
	doSetup();
}


const { promises: fs } = require("fs")
const yaml = require('js-yaml');

(async function main() {

	try {

		let configJson = await fs.readFile("./install/config.json", "utf-8")
		let doc = yaml.load(configJson)
		let configYaml = yaml.dump(doc)
		await fs.writeFile("./config.yaml", configYaml, "utf-8")
	} catch (error) {
		console.log(error)
	}

})()
