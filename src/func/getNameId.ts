import urlcat from "urlcat";
import { requestURL } from "./util";

export async function getNameId(appId: number, itemName: string) {
    const baseUrl = `https://steamcommunity.com/market/listings/`;
    const path = `${appId}/${itemName}`.replace(":", "%3a");

    const url = urlcat(baseUrl, path);
    const html = await requestURL(url, "text");

    const regex = /Market_LoadOrderSpread\((.*)\)/gm;
    const match = regex.exec(html).slice(0);

    return parseInt(match[1] ?? "-1");
}
