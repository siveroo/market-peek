import { Parser, ParserConfig } from "../parser";
import urlcat from "urlcat";
import { requestURL } from "./util";
import { SearchResponse } from "../interface/search";
import { Item } from "../item";

export async function search(config: ParserConfig, filter: object) {
    const baseUrl = `https://steamcommunity.com/market/search/render/`;

    let params = {
        start: 0,
        count: 10,
        l: config.language,
        currency: config.currency,
        appid: config.appid,
        norender: 1,
    };

    params = { ...params, ...filter };

    const url = urlcat(baseUrl, params);
    const response = (await requestURL(url)) as SearchResponse;

    return response.results.map((result) => new Item(result));
}
