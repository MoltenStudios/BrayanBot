const fs = require('fs'),
	YAML = require("yaml"),
	chalk = require('chalk'),
	Utils = require("../Utils"),
	{ SlashCommandBuilder } = require('@discordjs/builders'),
	{ client, config, lang, commands } = require("../../index");

module.exports = {
	getYAMLConfig: (addonName, addonConfig) => {
		if (fs.existsSync('./Addon_Configs') && fs.existsSync(`./Addon_Configs/${addonName}/${addonConfig}.yml`)) {
			return YAML.parse(fs.readFileSync(`./Addon_Configs/${addonName}/${addonConfig}.yml`, 'utf-8'));
		} else {
			return false;
		}
	},
	init: async () => {
		if (fs.existsSync('./Addons')) {
			fs.readdir('Addons', async (err, files) => {
				files = files.filter(f => f.split(".").pop() == 'js')
				if (files) {

					// Priority Sorting
					let priority = { "0": [], "1": [], "2": [], "3": [], }, index
					for (index = 0; index < files.length; index++) {
						let f = require(`../../Addons/${files[index]}`)
						if (f._priority) {
							if (f._priority == 1) priority[0].push(files[index])
							else if (f._priority == 2) priority[1].push(files[index])
							else if (f._priority == 3) priority[2].push(files[index])
							else priority[3].push(files[index])
						} else priority[3].push(files[index])
					}

					// Priority Executing 
					for (index = 0; index <= 5; index++) {
						let addonFiles = priority[index]
						if (addonFiles) {
							for (let y = 0; y < addonFiles.length; y++) {
								try {
									const addon = require(`../../Addons/${addonFiles[y]}`);
									if (addon && typeof addon.run == 'function') {
										// Custom Config
										let customConfig = {}, addonName = addon._name ? addon._name : file.replace('.js', '')
										if (addon._customConfigs && typeof addon._customConfigs == "object") {
											let configs = Object.entries(addon._customConfigs),
												generateConfig = (path, data, type) => {
													if (["yml", "yaml"].includes(type.toLowerCase())) {
														fs.writeFileSync(path, YAML.stringify(data, {
															indent: 2,
															prettyErrors: true
														}))
													} else if (["json"].includes(type.toLowerCase())) {
														fs.writeFileSync(path, JSON.stringify(data, null, 4))
													} else {
														fs.writeFileSync(path, data)
													}
												}
											if (!fs.existsSync('./Addon_Configs')) await fs.mkdirSync('./Addon_Configs')
											if (!fs.existsSync(`./Addon_Configs/${addonName}`)) await fs.mkdirSync(`./Addon_Configs/${addonName}`)
											configs.forEach((addonConfig) => {
												let [name, thing] = addonConfig,
													{ type, path, data } = thing;
												path = path.replace(/{addon-name}/g, addonName).toString()

												if (fs.existsSync(path)) {
													if (config.Settings.DevMode)
														generateConfig(path, data, type)
													if (["yml", "yaml"].includes(type.toLowerCase()))
														customConfig[name] = YAML.parse(fs.readFileSync(path, 'utf-8'), { prettyErrors: true })
													else if (["json"].includes(type.toLowerCase()))
														customConfig[name] = JSON.parse(fs.readFileSync(path, 'utf-8'))
													else
														customConfig[name] = fs.readFileSync(path, 'utf-8')
												} else {
													generateConfig(path, data, type)
												}
											})
										}

										// Executing Addon
										let dev = addon._customConfigs.main.DevMode
										if (dev) await addon.run(client, { main: addon._customConfigs.main.data, lang: addon._customConfigs.lang.data})
										else await addon.run(client, customConfig)

										// Addon Logging
										if (typeof addon._log == 'string' && !addon._author) {
											console.log(chalk.hex("##007bff").bold("[INFO] ") + addon._log)
										} else if (addon._log && typeof addon._author == 'string') {
											console.log(`${chalk.hex(addon._author.color || "##007bff").bold(`[${addon._author ? addon._author : '[INFO]'}]`)} ${chalk.bold(addon._name ? addon._name : file.replace('.js', ''))} addon loaded`)
										} else if (addon._log && typeof addon._author == 'object') {
											console.log(`${chalk.hex(addon._author.color || "##007bff").bold(`[${addon._author.name}]`)} ${chalk.bold(addon._name ? addon._name : file.replace('.js', ''))} addon loaded`)
										}
									} else {
										Utils.logWarning(`Unable to execute ${addon.
