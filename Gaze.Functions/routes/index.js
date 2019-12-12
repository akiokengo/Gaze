"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// リクエストのアドレスに対して、どの処理を割り当てるかを簡単に設定できる
// express framework
const express = require("express");
// 使いたい機能一覧をここに並べる
const index_1 = require("../Functions/index");
const search_1 = require("../Functions/search");
const url_1 = require("../Functions/url");
const render_1 = require("../Functions/render");
// ルーティングを簡単に振り分ける事ができる機能を有効化
const router = express.Router();
const cors = require('cors')({ Origin: true });
// ルートのアドレスにリクエストが来た場合は、このクラスの処理を返す
router.get('/', (req, res, next) => {
    cors(req, res, () => new index_1.default().execute(req, res, next));
});
// searchのアドレスにリクエストが来た場合は、このクラスの処理を返す
router.get('/search', (req, res, next) => {
    cors(req, res, () => new search_1.default().execute(req, res, next));
});
// searchのアドレスにリクエストが来た場合は、このクラスの処理を返す
router.get('/render', (req, res, next) => {
    cors(req, res, () => new render_1.default().execute(req, res, next));
});
// searchのアドレスにリクエストが来た場合は、このクラスの処理を返す
router.get('/url', (req, res, next) => {
    cors(req, res, () => new url_1.default().execute(req, res, next));
});
exports.default = router;
//# sourceMappingURL=index.js.map