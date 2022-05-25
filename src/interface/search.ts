export interface SearchResponse {
    success: boolean;
    start: number;
    pagesize: number;
    total_count: number;
    searchdata: {
        query: string;
        search_description: true;
        total_count: number;
        pagesize: number;
        prefix: string;
        class_prefix: number;
    };
    results: SearchResultItem[];
}

export interface SearchResultItem {
    name: string;
    hash_name: string;
    sell_listings: number;
    sell_price: number;
    sell_price_text: string;
    app_icon: string;
    app_name: string;
    asset_description: SearchResultItemAsset;
    sale_price_text: string;
}

export interface SearchResultItemAssetDescription {
    type: string;
    value: string;
    color: string;
}

export interface SearchResultItemAsset {
    appid: number;
    classid: string;
    instanceid: string;
    currency: number;
    background_color: string;
    icon_url: string;
    icon_url_large: string;
    descriptions: SearchResultItemAssetDescription[];
    tradable: number;
    name: string;
    name_color: string;
    type: string;
    market_name: string;
    market_hash_name: string;
    commodity: number;
    market_tradable_restriction: number;
    marketable: number;
    market_buy_country_restriction: string;
}
