import { getNameId } from "../func/getNameId";
import { SearchResultItem } from "../interface/search";
import { createMarketApp, MarketApp } from "./marketApp";

export interface MarketItem {
    name: string;
    hash_name: string;
    item_nameid: number;
    icon_url: string;
    app_info: MarketApp;
}

export async function createMarketItem(searchResultItem: SearchResultItem) {
    const result = {} as MarketItem;
    result.name = searchResultItem.name;
    result.hash_name = searchResultItem.hash_name;
    result.icon_url = searchResultItem.asset_description.icon_url;
    result.app_info = createMarketApp(searchResultItem);

    result.item_nameid = await getNameId(result.app_info.app_id, result.name);

    return result;
}
