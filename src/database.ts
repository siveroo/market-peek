import { PrismaClient } from "@prisma/client";
import { MarketApp } from "./entity/marketApp";
import { MarketItem } from "./entity/marketItem";
import { delay } from "./func/util";
import { Logger } from "./logger";

const prisma = new PrismaClient();

async function dbWrapper<T>(fn: Promise<T>, retries = 3): Promise<T> | null {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn;
        } catch (err) {
            Logger.error(err);
            await delay(30000);
            continue;
        }
    }

    return null;
}

export async function upsertApp(app: MarketApp) {
    return await dbWrapper(
        prisma.app.upsert({
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
        })
    );
}

export async function upsertItem(item: MarketItem) {
    return await dbWrapper(
        prisma.item.upsert({
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
        })
    );
}

export async function insertItem(item: MarketItem) {
    return await dbWrapper(
        prisma.item.create({
            data: {
                id: item.item_nameid,
                name: item.name,
                hash_name: item.hash_name,
                icon_url: item.icon_url,

                app_id: item.app_info.app_id,

                lastUpdatedAt: new Date(),
            },
        })
    );
}

export async function retrieveItemByName(name: string) {
    return await dbWrapper(
        prisma.item.findFirst({
            where: { name },
        })
    );
}

// fucking nasty syntax haha
export async function retrieveItemsByApp(app: MarketApp) {
    return (
        (await dbWrapper(
            prisma.item.findMany({
                where: {
                    app_id: app.app_id,
                },
            })
        )) ?? []
    );
}
