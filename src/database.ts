import { PrismaClient } from "@prisma/client";
import { MarketApp } from "./entity/marketApp";
import { MarketItem } from "./entity/marketItem";

const prisma = new PrismaClient();

export async function upsertApp(app: MarketApp) {
    return await prisma.app.upsert({
        where: {
            id: app.app_id,
        },
        update: {
            icon: app.app_icon,
            name: app.app_name,
        },
        create: {
            id: app.app_id,
            icon: app.app_icon,
            name: app.app_name,
        },
    });
}

export async function upsertItem(item: MarketItem) {
    return await prisma.item.upsert({
        where: {
            id: item.item_nameid,
        },
        update: {
            name: item.name,
            hash_name: item.hash_name,
            icon_url: item.icon_url,

            app_id: item.app_info.app_id,

            lastUpdatedAt: new Date(),
        },
        create: {
            id: item.item_nameid,
            name: item.name,
            hash_name: item.hash_name,
            icon_url: item.icon_url,

            app_id: item.app_info.app_id,

            lastUpdatedAt: new Date(),
        },
    });
}

export async function insertItem(item: MarketItem) {
    return await prisma.item.create({
        data: {
            id: item.item_nameid,
            name: item.name,
            hash_name: item.hash_name,
            icon_url: item.icon_url,

            app_id: item.app_info.app_id,

            lastUpdatedAt: new Date(),
        },
    });
}

export async function retrieveItemByName(name: string) {
    return await prisma.item.findFirst({
        where: { name },
    });
}
