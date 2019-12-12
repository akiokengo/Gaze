import express = require('express');
import scraperjs = require('scraperjs');
export default class functions {
    public execute(req: express.Request, res: express.Response, next: express.NextFunction) {
        let arr = new Array<string>();

        let uri = req.query["q"];
        res.redirect(uri);
    }
}
