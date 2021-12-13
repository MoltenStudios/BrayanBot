const { client, config, lang, commands } = require("../../index"),
    Utils = require("../Utils"),
    fs = require("fs");

module.exports = {
    init: () => {
        /*
        process.on('uncaughtException', async (error) => {
        }).on('unhandledRejection', async (reason, promise) => {
            if(reason.toString() == "Error [TOKEN_INVALID]: An invalid token was provided.") {
                Utils.logError("An invalid token was provided.")
                process.exit()
            }
            const promiseText = require("util").inspect(promise) || "";
            const lines = "-=".repeat(reason.toString().length);
        
            if(process.argv.includes('--errors')) {
                Utils.logError(`${reason.toString()}\n${promiseText}`)
            } 
            let data = `${lines}\n[[ Occured at: ${moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a')} ]]\n${lines}\n${reason.toString()}\n${promiseText}\n${lines}\n`
            fs.appendFile("./errors.txt", data, (err) => {
                if (err) Utils.logError(err);
                Utils.logError(`An error occured, You can view the error in errors.txt`)
            })
        })
        */
    },
};
