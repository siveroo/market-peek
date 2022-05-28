import { Country, Currency, getCountry, getCurrency } from "./enum";
import { fetchMarketItems } from "./func/fetchMarketItems";

const DEFAULT_OPTIONS = {
    appid: 252490,
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

    async scrap(filter: object = {}) {
        return await fetchMarketItems(this.config, filter);
    }
}
