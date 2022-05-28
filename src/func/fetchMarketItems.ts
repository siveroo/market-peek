import { ParserConfig } from "../parser";
import urlcat from "urlcat";
import { delay, requestURL } from "./util";
import { SearchResponse } from "../interface/search";
import { insertItem, retrieveItemByName, upsertApp } from "../database";
import { createMarketApp } from "../entity/marketApp";
import { createMarketItem, MarketItem } from "../entity/marketItem";

const COUNT_PER_REQUEST = 50;

export async function fetchMarketItems(config: ParserConfig, filter: object, limit = Infinity) {
    const ITEM_RETRIEVAL_DELAY = 15000;
    const items: MarketItem[] = [];

    const baseUrl = `https://steamcommunity.com/market/search/render/`;
    let params = {
        l: config.language,
        currency: config.currency,
        appid: config.appid,
        norender: 1,
        ...filter,
    };

    const itemCountLimit = Math.min(limit, await getTotalItems(baseUrl, params));
    for (let i = 0; i < itemCountLimit; i += COUNT_PER_REQUEST) {
        const page = {
            start: i,
            count: COUNT_PER_REQUEST,
        };

        params = { ...params, ...page };

        const url = urlcat(baseUrl, params);
        const response = (await requestURL(url, "json")) as SearchResponse;

        if (response === null || response.results.length === 0) {
            return items;
        }

        const app = createMarketApp(response.results[0]);
        await upsertApp(app);

        for await (const [index, result] of response.results.entries()) {
            if ((await retrieveItemByName(result.name)) !== null) {
                console.log(`[Search] Skipping item (${i + index + 1}/${itemCountLimit}) : ${result.name}`);
                continue;
            }

            console.log(`[Search] Fetching item (${i + index + 1}/${itemCountLimit}) : ${result.name}`);
            const item = await createMarketItem(result);
            items.push(item);

            await insertItem(item);
            await delay(ITEM_RETRIEVAL_DELAY);
        }
    }

    return items;
}

async function getTotalItems(baseUrl: string, params: object) {
    const url = urlcat(baseUrl, params);

    try {
        const response = (await requestURL(url, "json")) as SearchResponse;
        return response.total_count;
    } catch (error) {
        return 0;
    }
}
