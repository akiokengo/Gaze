// リクエストのアドレスに対して、どの処理を割り当てるかを簡単に設定できる
// express framework
import express = require('express');


// 使いたい機能一覧をここに並べる
import index from "../Functions/index";
import search from "../Functions/search";
import u from "../Functions/url";
import r from "../Functions/render";

// ルーティングを簡単に振り分ける事ができる機能を有効化
const router = express.Router();
const cors = require('cors')({ Origin: true });


// ルートのアドレスにリクエストが来た場合は、このクラスの処理を返す
router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    cors(req, res, () => new index().execute(req, res, next));
});

// searchのアドレスにリクエストが来た場合は、このクラスの処理を返す
router.get('/search', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    cors(req, res, () => new search().execute(req, res, next));
});

// searchのアドレスにリクエストが来た場合は、このクラスの処理を返す
router.get('/render', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    cors(req, res, () => new r().execute(req, res, next));
});

// searchのアドレスにリクエストが来た場合は、このクラスの処理を返す
router.get('/url', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    cors(req, res, () => new u().execute(req, res, next));
});

export default router;

