import express = require('express');
import scraperjs = require('scraperjs');
export default class search {
    public execute(req: express.Request, res: express.Response, next: express.NextFunction) {
        let arr = new Array<string>();

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
                res.send(html);
            }).catch((error) => {
                res.send(`error=>${error}`);
            });
    }
}
