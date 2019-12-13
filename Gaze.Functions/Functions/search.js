"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraperjs = require("scraperjs");
class search {
    execute(req, res, next) {
        let arr = new Array();
        // http://www13.plala.or.jp/bigdata/google.html
        arr.push(`lr=lang_ja`);
        arr.push(`hl=ja`);
        arr.push(`inlang=ja`);
        arr.push(`ie=utf-8`);
        arr.push(`oe=utf-8`);
        let startCount = req.query["start"];
        if (startCount) {
            arr.push(`start=${startCount}`);
        }
        let queryString = encodeURIComponent(req.query["q"]);
        arr.push(`q=${queryString}`);
        let uri = `https://www.google.co.jp/search?${arr.join("&")}`;
        scraperjs.StaticScraper.create(uri)
            .scrape($ => {
            return $.html();
        }).then(html => {
            res.send(html);
        }).catch((error) => {
            res.send(`error=>${error}`);
        });
    }
}
exports.default = search;
//# sourceMappingURL=search.js.map