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
                let idex = this.Threshold;
                if (pair.container == "root") {
                    idex = this.Threshold;
                }
                if (pair.container == "GoogleFrame") {
                    idex = this.Threshold / 2;
                }
                if (pair.container == "SearchFrame") {
                    idex = this.Threshold * 2;
                }
                if (idex < pair.count) {
                    let element = document.getElementById(key);
                    //let element = this.Doc.getElementById(key);
                    //if (!element) {
                    //    element = document.getElementById(key);
                    //}
                    console.info(`☆${key}`);
                    if (this.IsInputElement(element)) {
                        let input = element;
                        if (input.type == "button") {
                            input.onclick(null);
                        }
                    }
                    else if (this.IsButtonElement(element)) {
                        let button = element;
                        button.onclick(null);
                    }
                }
                else if (pair.container === "SearchFrame") {
                    let w = this.SearchFrame.contentWindow;
                    let request = {
                        message: "click",
                        id: key,
                    };
                    let json = JSON.stringify(request);
                    w.postMessage(json, "*");
                }
            }
            this.Dic = {};
            /**/
            //window.addEventListener("message", e => {
            //    if (!e.data) {
            //        return;
            //    }
            //    let request = JSON.parse(e.data);
            //    if (!request) {
            //        return;
            //    }
            //    if (request.message == "ParseScroll") {
            //        let scrollingElement = document.scrollingElement;
            //        let clientHeight = scrollingElement.clientHeight;
            //        let clientWidth = scrollingElement.clientWidth;
            //        if (clientHeight == 0 || clientWidth == 0) {
            //            return;
            //        }
            //        let h = scrollingElement.scrollHeight;
            //        let w = scrollingElement.scrollWidth;
            //        // ディスプレイの↓ばかりみてた場合
            //        if ((clientHeight - 300) < request.scrollMedian.Y) {
            //            scrollingElement.scrollTop += 100;
            //        }
            //        else if (request.scrollMedian.Y < 200) {
            //                // ↑ばかりみてた場合
            //                scrollingElement.scrollTop -= 100;
            //            }
            //        }
            //        if (request.message == "Position") {
            //            let el = document.elementFromPoint(request.median.X, request.median.Y);
            //            if (el) {
            //                // 要素にIDが降られていなければ
            //                if (!el.id) {
            //                    // 一意な文字列を割り当てる
            //                    el.id = NewUid();
            //                }
            //                let response = {
            //                    message: "RePosition-2",
            //                    id: el.id,
            //                };
            //                // 送信先に返信する
            //                let w = e.source;
            //                if (w) {
            //                    w.postMessage(JSON.stringify(response), e.origin);
            //                }
            //            }
            //        }
            //        if (request.message == "click") {
            //            let el = document.getElementById(request.id);
            //            if (IsInputElement(el)) {
            //                let input = el;
            //                if (input.type == "button") {
            //                    input.onclick(null);
            //                }
            //            }
            //            else if (IsButtonElement(el)) {
            //                let button = el;
            //                button.onclick(null);
            //            }
            //        }
            //    });
            /**/
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
            // 視線の座標真下だと、ポインターだけが記録されるので
            // 視線のまわり四つまでを一度に記録する
            this.AddElement({ X: p.X - 10, Y: p.Y - 10 });
            this.AddElement({ X: p.X - 10, Y: p.Y + 10 });
            this.AddElement({ X: p.X, Y: p.Y });
            this.AddElement({ X: p.X + 10, Y: p.Y - 10 });
            this.AddElement({ X: p.X + 10, Y: p.Y + 10 });
        }
        AddElement(p) {
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
            if (id == "BackButton") {
                obj.count += 0.5;
            }
            else if (id == "learn") {
                obj.count = 0;
            }
            else {
                obj.count += 1;
            }
            console.info(`□${id}`);
            this.Dic[id] = obj;
        }
    }
    Gaze.DotElementParser = DotElementParser;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=DotElementParser.js.map