var Gaze;
(function (Gaze) {
    class DotElementParser {
        constructor(msec, threshold) {
            this.Dic = {};
            this.IsValid = false;
            this.ScrollMedian = new Gaze.ScrollMedian();
            this._buffGooglePonter = new Array();
            this.Threshold = threshold;
            // IFrameが存在するか確認
            this.GoogleFrame = document.getElementById("_frame");
            this.SearchFrame = document.getElementById("_frameSearch");
            if (!this.GoogleFrame || !this.SearchFrame) {
                return;
            }
            this.IsValid = true;
            window.addEventListener("message", e => {
                if (!e.data) {
                    return;
                }
                let request = JSON.parse(e.data);
                if (!request) {
                    return;
                }
                // 子①GoogleFrameの視線の先にあるコンテンツを登録する
                if (request.message == "RePosition-1") {
                    if (request.id) {
                        this.Increment(request.id, "GoogleFrame");
                    }
                }
                else if (request.message == "RePosition-2") {
                    if (request.id) {
                        this.Increment(request.id, "SearchFrame");
                    }
                }
            });
            // 指定時間経過後に、判定
            setInterval(() => {
                this.Parse();
            }, msec);
            // 指定時間経過後に、判定
            setInterval(() => {
                this.ParseScroll();
            }, msec / 10);
        }
        ParseScroll() {
            let median = this.ScrollMedian.Generate();
            let frame = document.getElementById("_frameSearch");
            let request = {
                message: "ParseScroll",
                scrollMedian: median
            };
            // スクロール対象は、_frameSearchのみなので、直指定でメッセージ通知
            let json = JSON.stringify(request);
            frame.contentWindow.postMessage(json, "*");
        }
        /**
         * 視線をもとに、処理を実装する
         * */
        Parse() {
            let tuples = new Array();
            for (var key in this.Dic)
                tuples.push([key, this.Dic[key].count]);
            tuples.sort(function (a, b) {
                a = a[1];
                b = b[1];
                return a < b ? -1 : (a > b ? 1 : 0);
            });
            tuples = tuples.reverse();
            for (var i = 0; i < tuples.length; i++) {
                let key = tuples[i][0];
                let pair = this.Dic[key];
                // 指定した閾値を超える場合
                if (this.Threshold < pair.count) {
                    //let element = this.Doc.getElementById(key);
                    //if (!element) {
                    //    element = document.getElementById(key);
                    //}
                    //if (this.IsInputElement(element)) {
                    //    let input = element as HTMLInputElement;
                    //    if (input.type == "button") {
                    //        input.onclick(null);
                    //    }
                    //} else if (this.IsButtonElement(element)) {
                    //    let button = element as HTMLButtonElement;
                    //    button.onclick(null);
                    //}
                }
            }
            this.Dic = {};
        }
        IsInputElement(arg) {
            return arg !== null &&
                typeof arg === "object" &&
                typeof arg.value === "string";
        }
        IsButtonElement(arg) {
            return arg !== null &&
                typeof arg === "object" &&
                typeof arg.formAction === "string";
        }
        Add(p) {
            if (!this.IsValid) {
                return;
            }
            this.ScrollMedian.Add(p.X, p.Y);
            // 親要素(主に左側の6個のボタン)
            let el = document.elementFromPoint(p.X, p.Y);
            if (el) {
                // 要素にIDが降られていなければ
                if (String.IsNullOrWhiteSpace(el.id)) {
                    // 一意な文字列を割り当てる
                    el.id = NewUid();
                }
                this.Increment(el.id, "root");
            }
            //子①GoogleFrame（同一オリジンなので、やりやすい）
            //this.AddGoogleSearch(p);
            let googleWindow = this.GoogleFrame.contentWindow;
            let request = {
                message: "Position",
                median: p
            };
            googleWindow.postMessage(JSON.stringify(request), location.origin);
            ////子②SearchFrame（こっちはスクレイピングしたオリジンが異なるものなので、黒魔法が必要）
            let searchWindow = this.SearchFrame.contentWindow;
            searchWindow.postMessage(JSON.stringify(request), "*");
        }
        /**
         * マシンパフォーマンスが低い場合は、一括でやるほうも検討する
         * @param p
         */
        AddGoogleSearch(p) {
            if (100 < this._buffGooglePonter.length) {
                //子①GoogleFrame（同一オリジンなので、やりやすい）
                let googleWindow = this.GoogleFrame.contentWindow;
                let request = {
                    message: "Position",
                    median: p
                };
                googleWindow.postMessage(JSON.stringify(request), location.origin);
                this._buffGooglePonter = new Array();
            }
            else {
                this._buffGooglePonter.push(p);
            }
        }
        Increment(id, countaier) {
            if (!this.Dic[id]) {
                this.Dic[id] = { container: countaier, count: 0 };
            }
            let obj = this.Dic[id];
            obj.count += 1;
            this.Dic[id] = obj;
        }
    }
    Gaze.DotElementParser = DotElementParser;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=DotElementParser.js.map