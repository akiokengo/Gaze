"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class functions {
    execute(req, res, next) {
        let arr = new Array();
        let uri = req.query["q"];
        res.redirect(uri);
    }
}
exports.default = functions;
//# sourceMappingURL=url.js.map