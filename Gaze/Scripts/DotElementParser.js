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
            //子①GoogleFrame（同一オリジンなので、やりやすい）
            this.GoogleFrame.contentWindow.addEventListener("message", e => {
                if (!e.data) {
                    return;
                }
                let request = JSON.parse(e.data);
                if (!request) {
                    return;
                }
                // 視線の先にあるコンテンツを登録する
                if (request.message == "RePosition-1") {
                    if (request.id) {
                        this.Increment(request.id);
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
            let json = JSON.stringify(request);
            frame.contentWindow.postMessage(json, "*");
            //window.addEventListener("message", e => {
            //    if (!e.data) {
            //        return;
            //    }
            //    let request: {
            //        message: string,
            //        scrollMedian: {
            //            X: number,
            //            Y: number
            //        }
            //    } = JSON.parse(e.data);
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
            //        const adjust = 300;
            //        if ((clientHeight - adjust) < request.scrollMedian.Y) {
            //            scrollingElement.scrollTop += 100;
            //        } else if (request.scrollMedian.Y < adjust) {
            //            // ↑ばかりみてた場合
            //            scrollingElement.scrollTop -= 100;
            //        }
            //    }
            //});
        }
        /**
         * 視線をもとに、処理を実装する
         * */
        Parse() {
            let tuples = new Array();
            for (var key in this.Dic)
                tuples.push([key, this.Dic[key]]);
            tuples.sort(function (a, b) {
                a = a[1];
                b = b[1];
                return a < b ? -1 : (a > b ? 1 : 0);
            });
            tuples = tuples.reverse();
            for (var i = 0; i < tuples.length; i++) {
                let key = tuples[i][0];
                let value = tuples[i][1];
                // 指定した閾値を超える場合
                if (this.Threshold < value) {
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
                this.Increment(el.id);
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
            //let searchWindow = this.SearchFrame.contentWindow;
            //el = this.Doc.elementFromPoint(p.X, p.Y);
            //if (el) {
            //    // 要素にIDが降られていなければ
            //    if (String.IsNullOrWhiteSpace(el.id)) {
            //        // 一意な文字列を割り当てる
            //        el.id = this.NewUid();
            //    }
            //    if (!this.Dic[el.id]) {
            //        this.Dic[el.id] = 0;
            //    }
            //    this.Dic[el.id] += 1;
            //}
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
        Increment(id) {
            if (!this.Dic[id]) {
                this.Dic[id] = 0;
            }
            this.Dic[id] += 1;
        }
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
        // https://stackoverflow.com/questions/1192228/scrolling-an-iframe-with-javascript
        /*
         *スクロールメソッドの定義
         * sclolldown:下にスクロール
         * sclollup:上にスクロール
         * */
        scrolldown() {
            let frame = document.getElementById("_frameSearch");
            var top = frame.contentWindow.scrollY;
            frame.contentWindow.scrollTo(0, top + 100);
        }
        scrollup() {
            let frame = document.getElementById("_frameSearch");
            var top = frame.contentWindow.scrollY;
            frame.contentWindow.scrollTo(0, top - 100);
        }
    }
    Gaze.DotElementParser = DotElementParser;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=DotElementParser.js.map