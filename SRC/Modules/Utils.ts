import chalk from "chalk";

export = {
    logger: {
        debug: (...text: any[]) => console.log(chalk.magentaBright.bold("[DEBUG]"), ...text),
        info: (...text: any[]) =>  console.log(chalk.greenBright.bold("[INFO]"), ...text),
        warn: (...text: any[]) =>  console.log(chalk.yellowBright.bold("[WARN]"), ...text),
        error: (...text: any[]) => console.log(chalk.redBright.bold("[ERROR]"), ...text),
    }
}