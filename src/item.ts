import { SearchResultItem } from "./interface/search";

interface ItemProperty {
    name: string;
    hash_name: string;
    icon_url: string;
    app_info: AppInfo;
}

interface AppInfo {
    app_icon: string;
    app_name: string;
    app_id: number;
}

export class Item implements ItemProperty {
    name: string;
    hash_name: string;
    icon_url: string;
    app_info: AppInfo;

    constructor(property: SearchResultItem) {
        this.name = property.name;
        this.hash_name = property.hash_name;
        this.icon_url = property.asset_description.icon_url;
        this.app_info = {
            app_icon: property.app_icon,
            app_name: property.app_name,
            app_id: property.asset_description.appid,
        };
    }
}
