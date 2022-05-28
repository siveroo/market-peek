import express from "express";
import { Parser } from "./parser";

const app = express();

const parser = new Parser();

(async function () {
    const items = await parser.scrap();
    console.log(items);

    app.listen(3000);
})();

export const marketAPI = app;
