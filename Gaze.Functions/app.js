"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const index_1 = require("./routes/index");
var app = express();
app.use('/', index_1.default);
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
//# sourceMappingURL=app.js.map