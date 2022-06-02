import { ParserConfig } from "../parser";
import urlcat from "urlcat";
import { delay, requestURL } from "./util";
import { SearchResponse } from "../interface/search";
import { retrieveItemsByApp, upsertApp, upsertItem } from "../database";
import { createMarketApp } from "../entity/marketApp";
import { createMarketItem } from "../entity/marketItem";

export async function fetchMarketItems(config: ParserConfig, filter: object) {
    const baseUrl = `https://steamcommunity.com/market/search/render/`;
    const param = {
        l: config.language,
        currency: config.currency,
        appid: config.appid,
        norender: 1,
        ...filter,
    };
    const initialRequestUrl = urlcat(baseUrl, param);
    const initialResponse = (await requestURL(initialRequestUrl, "json")) as SearchResponse | null;
    const itemCount = initialResponse?.total_count;

    if (initialResponse === null || !(itemCount > 0)) return;

    const app = createMarketApp(initialResponse.results[0]);
    const upsertedApp = await upsertApp(app);

    if (upsertedApp === null) return;

    const storedItemsName = (await retrieveItemsByApp(app)).map((item) => item.name);
    const batchSize = 50;

    for (let i = 0; i < itemCount; i += batchSize) {
        const page = {
            start: i,
            count: batchSize,
        };

        const itemRequestUrl = urlcat(baseUrl, { ...param, ...page });
        const response = (await requestURL(itemRequestUrl, "json")) as SearchResponse;
        const ITEM_RETRIEVAL_DELAY = 20000;

        if (response === null) continue;
        const itemEntries = response.results.entries();

        for await (const [index, item] of itemEntries) {
            if (storedItemsName.includes(item.name)) {
                console.log(`[MarketFetch] Item '${item.name}' is already stored! (${i + index + 1}/${itemCount})`);
                continue;
            }

            console.log(`[MarketFetch] Fetching item '${item.name}' from the Steam Market. (${i + index + 1}/${itemCount})`);

            const marketItem = await createMarketItem(item);
            if (marketItem === null || marketItem.item_nameid === null) {
                console.warn(
                    `[MarketFetch] Failed to fetch Item '${item.name}' from Steam Market! (${i + index + 1}/${itemCount})`
                );
                await delay(ITEM_RETRIEVAL_DELAY);
                continue;
            }

            const upsertedItem = await upsertItem(marketItem);
            if (upsertItem === null) {
                console.warn(`[MarketFetch] Item '${item.name}' failed to save in database! (${i + index + 1}/${itemCount})`);
            }

            await delay(ITEM_RETRIEVAL_DELAY);
        }

        await delay(ITEM_RETRIEVAL_DELAY);
    }
}
