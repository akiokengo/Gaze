"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraperjs = require("scraperjs");
class render {
    execute(req, res, next) {
        let arr = new Array();
        let queryString = req.query["q"];
        arr.push(`q=${queryString}`);
        arr.push(`rlz=1C1CHBD_jaJP858JP858`);
        let startCount = req.query["start"];
        if (startCount) {
            arr.push(`start=${startCount}`);
        }
        let uri = `https://www.google.com/search?${arr.join("&")}`;
        scraperjs.StaticScraper.create(uri)
            .scrape($ => {
            return $.html();
        }).then(html => {
            res.render(html);
        }).catch((error) => {
            res.send(`error=>${error}`);
        });
    }
}
exports.default = render;
//# sourceMappingURL=render.js.map