import { SearchResultItem } from "../interface/search";

export interface MarketApp {
    app_icon: string;
    app_name: string;
    app_id: number;
}

export function createMarketApp(searchResultItem: SearchResultItem): MarketApp {
    return {
        app_icon: searchResultItem.app_icon,
        app_name: searchResultItem.app_name,
        app_id: searchResultItem.asset_description.appid,
    };
}
