import chalk from "chalk";

export = {
    logger: {
        debug: (...text: any[]) => console.log(chalk.hex("#ffff00").bold("[DEBUG]"), ...text),
        info: (...text: any[]) =>  console.log(chalk.hex("#57ff6b").bold("[INFO]"), ...text),
        warn: (...text: any[]) =>  console.log(chalk.hex("#edd100").bold("[WARN]"), ...text),
        error: (...text: any[]) => console.log(chalk.hex("#ff0800").bold("[ERROR]"), ...text),
    }
}