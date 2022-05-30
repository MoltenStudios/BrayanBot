const Utils = require("../Utils"), fs = require("fs"), chalk = require("chalk"),
    path = require("path"), moment = require('moment'),

    express = require("express"), cors = require('cors'),
    favicon = require("serve-favicon"), bodyParser = require("body-parser"),
    rateLimit = require("express-rate-limit");

module.exports = {
    app: express(),
    get: (endPoint, callBack) => require("../../index").client.Routes.set(endPoint, { method: "get", endPoint, callBack }),
    post: (endPoint, callBack) => require("../../index").client.Routes.set(endPoint, { method: "post", endPoint, callBack }),
    getIP: (req) => {
        let ip = req.ip
            || req._remoteAddress
            || (req.connection && req.connection.remoteAddress)

        ip = ip.replace("::ffff:", "").replace("::", "");
        if (ip == 1) ip = "127.0.0.1"
        return ip
    },
    init: async () => {
        const { client, config } = require("../../index");

        if (config.WebServer && config.WebServer.Enabled) {
            const { app, getIP } = module.exports;
            const isValidUrl = (url) => {
                let check = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
                if (check !== null) return true;
            }
            if (!fs.existsSync('WebServer/'))
                fs.mkdirSync('WebServer/');

            if (!fs.existsSync('WebServerLog.txt'))
                fs.writeFileSync('WebServerLog.txt', "", { encoding: "utf-8" });

            app.use(cors())
            app.use(bodyParser.json())
            app.use(express.static('./WebServer/'));
            app.use(bodyParser.urlencoded({ extended: false }))

            app.use((req, res, next) => {
                if (config.Settings.DevMode)
                    console.log(chalk.hex("#03c6fc").bold("[WebS] ") + `${getIP(req)} » ${req.method} ${chalk.bold(req.url)}`)

                fs.appendFileSync("WebServerLog.txt", `${moment().format('MMMM Do YYYY, h:mm:ss a')} | ${getIP(req)} » ${req.method} ${req.url}\n`)
                next()
            })

            config.WebServer.Ratelimit ? config.WebServer.Ratelimit.Enabled ? app.use(rateLimit({
                windowMs: 1 * 60 * 1000,
                max: config.WebServer.Ratelimit ? config.WebServer.Ratelimit.MaxRequests : 60,
                keyGenerator: (req, res) => getIP(req),
                skip: (req, res) => {
                    let allowedIPs = config.WebServer.Ratelimit.BypassIPs
                        ? Array.isArray(config.WebServer.Ratelimit.BypassIPs)
                            ? config.WebServer.Ratelimit.BypassIPs : [] : [];

                    return allowedIPs.includes(getIP(req))
                },
                handler: (req, res, next) => {
                    if (req.method == "GET") {
                        if (config.Settings.DevMode)
                            console.log(chalk.hex("#ffd900").bold("[RateLimit] ") + `${chalk.bold(getIP(req))} is being rate limited.`)
                        return res.status(429).sendFile(path.join(__dirname, '../../WebServer/429.html'))
                    } else {
                        if (config.Settings.DevMode)
                            console.log(chalk.hex("#ffd900").bold("[RateLimit] ") + `${chalk.bold(getIP(req))} is being rate limited.`)
                        return res.status(429).send({
                            StatusCode: 429,
                            Error: "Too Many Requests",
                            Message: "You are being rate limited. Please wait sometime before requesting again."
                        })
                    }
                }
            })) : "" : "";

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
                                    Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("URL")} required. Received: ${URL}`)
                                }
                                break;
                            }

                            case 'page': {
                                if (File && fs.existsSync(path.join(__dirname, '../../WebServer', File))) {
                                    app.get(EndPoint, (req, res) => res.status(200).sendFile(path.join(__dirname, '../../WebServer', File)))
                                } else if (!fs.existsSync(path.join(__dirname, '../../WebServer', File))) {
                                    Utils.logWarning(`[WS] [EndPoints] ${chalk.bold(File)} not found.`)
                                } else {
                                    Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("File")} required. Received: ${File}`)
                                }
                                break;
                            }

                            case 'file': {
                                if (File && fs.existsSync(path.join(__dirname, '../../WebServer', File))) {
                                    app.get(EndPoint, (req, res) => res.status(200).download(path.join(__dirname, '../../WebServer', File)))
                                } else if (!fs.existsSync(path.join(__dirname, '../../WebServer', File))) {
                                    Utils.logWarning(`[WS] [EndPoints] ${chalk.bold(File)} not found.`)
                                } else {
                                    Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("File")} required. Received: ${File}`)
                                }
                                break;
                            }
                        }
                    } else if (!Type) {
                        Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("Type")} required. Received: ${Type}`)
                    } else if (!EndPoint) {
                        Utils.logWarning(`[WS] [EndPoints] Valid ${chalk.bold("EndPoint")} required. Received: ${EndPoint}`)
                    }
                }
            }

            client.Routes.forEach(({ method, endPoint, callBack }) => app[method] ? app[method](endPoint, callBack) : false)

            if (fs.existsSync(path.join(__dirname, '../../WebServer/404.html')))
                app.get("*", (req, res) => res.status(404).sendFile(path.join(__dirname, '../../WebServer/404.html')))
        }
    }
}