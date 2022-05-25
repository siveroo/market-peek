import { Country, Currency, getCountry, getCurrency } from "./enum";
import { search } from "./func/search";

const DEFAULT_OPTIONS = {
    appid: 730,
    currency: "IDR" as Currency,
    country: "Indonesia" as Country,
    language: "English",
};

export type ParserOptions = Partial<typeof DEFAULT_OPTIONS>;

export interface ParserConfig {
    appid: number;
    currency: number;
    country: string;
    language: string;
}

export class Parser {
    config: ParserConfig;

    constructor(options?: ParserOptions) {
        const config = { ...DEFAULT_OPTIONS, ...(options ?? {}) };

        this.config = {
            appid: config.appid,
            currency: getCurrency(config.currency),
            country: getCountry(config.country),
            language: config.language,
        };
    }

    async searchItem(filter: object = {}) {
        return await search(this.config, filter);
    }
}
