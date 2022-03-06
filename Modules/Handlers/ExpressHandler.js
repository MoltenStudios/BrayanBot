const { client, config, lang, commands } = require("../../index"),
    Utils = require("../Utils"),
    fs = require("fs"), chalk = require("chalk"),
    path = require("path"), moment = require('moment');


const express = require("express"),
    cors = require('cors'),
    favicon = require("serve-favicon"),
    bodyParser = require("body-parser");
const djs = require("discord.js");

module.exports = {
    app: express(),
    get: (endPoint, callBack) => client.Routes.set(endPoint, { method: "get", endPoint, callBack }),
    post: (endPoint, callBack) => client.Routes.set(endPoint, { method: "post", endPoint, callBack }),
    getIP: (req) => {
        return req.ip
            || req._remoteAddress
            || (req.connection && req.connection.remoteAddress)
    },
    init: async () => {
        if (config.WebServer && config.WebServer.Enabled) {
            const { app, getIP } = module.exports;
            const isValidUrl = (url) => {
                let check = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                if (check !== null) return true;
            }
            if (!fs.existsSync('WebServer/'))
                fs.mkdirSync('WebServer/')

            app.use(cors())
            app.use(bodyParser.json())
            app.use(express.static('./WebServer/'));
            app.use(bodyParser.urlencoded({ extended: false }))

            if (config.WebServer.Favicon && typeof config.WebServer.Favicon == "string")
                if (fs.existsSync(path.join(__dirname, '../../WebServer', config.WebServer.Favicon)))
                    app.use(favicon(path.join(__dirname, '../../WebServer', config.WebServer.Favicon)));

            if (config.WebServer.EndPoints && Array.isArray(config.WebServer.EndPoints) && config.WebServer.EndPoints[0]) {
                for (let index = 0; index < config.WebServer.EndPoints.length; index++) {
                    const { Type, EndPoint, URL, File } = config.WebServer.EndPoints[index];
                    if (Type && EndPoint) {
                        switch (Type.toLowerCase()) {
                            case 'url': {
                                if (URL && isValidUrl(URL)) {
                                    app.get(EndPoint, (req, res) => res.redirect(URL))
                                } else {
                                    Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("URL")} required. Recieved: ${URL}`)
                                }
                                break;
                            }

                            case 'page': {
                                if (File && fs.existsSync(path.join(__dirname, '../../WebServer', File))) {
                                    app.get(EndPoint, (req, res) => res.status(200).sendFile(path.join(__dirname, '../../WebServer', File)))
                                } else if (!fs.existsSync(path.join(__dirname, '../../WebServer', File))) {
                                    Utils.logWarning(`[WS] [EndPoints] ${chalk.bold(File)} not found.`)
                                } else {
                                    Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("File")} required. Recieved: ${File}`)
                                }
                                break;
                            }

                            case 'file': {
                                if (File && fs.existsSync(path.join(__dirname, '../../WebServer', File))) {
                                    app.get(EndPoint, (req, res) => res.status(200).download(path.join(__dirname, '../../WebServer', File)))
                                } else if (!fs.existsSync(path.join(__dirname, '../../WebServer', File))) {
                                    Utils.logWarning(`[WS] [EndPoints] ${chalk.bold(File)} not found.`)
                                } else {
                                    Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("File")} required. Recieved: ${File}`)
                                }
                                break;
                            }
                        }
                    } else if (!Type) {
                        Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("Type")} required. Recieved: ${Type}`)
                    } else if (!EndPoint) {
                        Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("EndPoint")} required. Recieved: ${EndPoint}`)
                    }
                }
            }

            client.Routes.forEach(({ method, endPoint, callBack }) => app[method](endPoint, callBack))

            if (fs.existsSync(path.join(__dirname, '../../WebServer/404.html')))
                app.get("*", (req, res) => res.status(404).sendFile(path.join(__dirname, '../../WebServer/404.html')))
        }
    }
}