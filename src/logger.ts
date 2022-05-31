import chalk from "chalk";
import prettyjson from "prettyjson";

const colors = {
    INFO: 219,
    SUCCESS: 222,
    WARNING: 124,
    ERROR: 196,
    DEBUG: 36,
};

type LoggerType = keyof typeof colors;

type LoggerConfig = {
    [T in {
        [T in keyof Logger]: Logger[T] extends string | number | boolean ? T : never;
    }[keyof Logger]]: Logger[T];
};

export class Logger {
    title = "";
    titleStyle = "bold";
    messageStyle = "";
    spacedTitle = true;
    invertedTitleColor = true;

    static expandObject = true;

    constructor(config?: Partial<LoggerConfig>) {
        config = { ...this, ...config };

        this.title = config.title;
        this.titleStyle = config.titleStyle;
        this.messageStyle = config.messageStyle;
        this.spacedTitle = config.spacedTitle;
        this.invertedTitleColor = config.invertedTitleColor;
    }

    print(message?: any, ...optionalParams: any[]) {
        let formattedTitle = "";
        if (this.title !== "") {
            if (this.spacedTitle) {
                formattedTitle = ` ${this.title} `;
            } else {
                formattedTitle = this.title;
            }

            if (this.invertedTitleColor) {
                formattedTitle = chalk.inverse(formattedTitle);
            }

            if (this.titleStyle !== "") {
                formattedTitle = chalk`{${this.titleStyle} ${formattedTitle}}`;
            }
        }

        let formattedMessage = Logger.buildString(this.messageStyle, message, ...optionalParams);

        if (formattedTitle === "") {
            console.log(formattedMessage);
            return;
        }

        console.log(`${formattedTitle} ${formattedMessage}`);
    }

    static info = (message?: any, ...optionalParams: any[]) => {
        this.styledPrint("INFO", message, ...optionalParams);
    };

    static success = (message?: any, ...optionalParams: any[]) => {
        this.styledPrint("SUCCESS", message, ...optionalParams);
    };

    static debug = (message?: any, ...optionalParams: any[]) => {
        this.styledPrint("DEBUG", message, ...optionalParams);
    };

    static warn = (message?: any, ...optionalParams: any[]) => {
        this.styledPrint("WARNING", message, ...optionalParams);
    };

    static error = (message?: any, ...optionalParams: any[]) => {
        this.styledPrint("ERROR", message, ...optionalParams);
    };

    private static styledPrint(type: LoggerType, message?: any, ...optionalParams: any[]) {
        message = message ?? "";

        const color = colors[type];
        const style = `ansi256(${color})`;
        const formattedMessage = this.buildString(style, message, ...optionalParams);
        const result = chalk.bold.inverse.ansi256(color)(` ${type} `) + " " + formattedMessage;

        console.log(result);
    }

    private static buildString(style: string, message?: any, ...optionalParams: any[]) {
        message = message ?? "";

        let result = this.preprocess(style, message);

        optionalParams.forEach((param) => {
            result += " " + this.preprocess(style, param);
        });

        return result;
    }

    private static preprocess(style: string, message: any) {
        if (typeof message === "object" && this.expandObject) {
            return "\n" + prettyjson.render(message);
        }

        if (style !== "") {
            return chalk`{${style} ${message.toString()}}`;
        }

        return message.toString();
    }
}
