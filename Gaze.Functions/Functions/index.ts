import express = require('express');

export default class index {
    public execute(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.send("(´･ω･｀)");
    }
}
