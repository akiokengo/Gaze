namespace Gaze {


    export class DotElementParser {
        protected Dic: { [key: string]: { container: string, count: number } } = {};


        protected Threshold: number;
        protected IsValid = false;
        protected ScrollMedian: ScrollMedian = new ScrollMedian();
        protected GoogleFrame: HTMLIFrameElement;
        protected SearchFrame: HTMLIFrameElement;
        constructor(msec: number, threshold: number) {
            this.Threshold = threshold;

            // IFrameが存在するか確認
            this.GoogleFrame = document.getElementById("_frame") as HTMLIFrameElement;
            this.SearchFrame = document.getElementById("_frameSearch") as HTMLIFrameElement;
            if (!this.GoogleFrame || !this.SearchFrame) {
                return;
            }

            this.IsValid = true;


            window.addEventListener("message", e => {
                if (!e.data) {
                    return;
                }

                let request: {
                    message: string,
                    id: string
                } = JSON.parse(e.data);

                if (!request) {
                    return;
                }

                // 子①GoogleFrameの視線の先にあるコンテンツを登録する
                if (request.message == "RePosition-1") {
                    if (request.id) {
                        this.Increment(request.id, "GoogleFrame");
                    }
                } else if (request.message == "RePosition-2") {
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

        protected ParseScroll() {
            let median = this.ScrollMedian.Generate();

            let frame = document.getElementById("_frameSearch") as HTMLIFrameElement;

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
        protected Parse() {
            let tuples = new Array<{}>();
            for (var key in this.Dic)
                tuples.push([key, this.Dic[key].count]);

            tuples.sort(function (a, b) {
                a = a[1];
                b = b[1];
                return a < b ? -1 : (a > b ? 1 : 0);
            });

            tuples = tuples.reverse();

            for (var i = 0; i < tuples.length; i++) {
                let key: string = tuples[i][0];
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
                        let input = element as HTMLInputElement;
                        if (input.type == "button") {
                            input.onclick(null);
                        }
                    } else if (this.IsButtonElement(element)) {
                        let button = element as HTMLButtonElement;
                        button.onclick(null);
                    }
                }
            }

            this.Dic = {};
        }

        protected IsInputElement(arg: any): arg is HTMLInputElement {
            return arg !== null &&
                typeof arg === "object" &&
                typeof arg.value === "string";
        }
        protected IsButtonElement(arg: any): arg is HTMLButtonElement {
            return arg !== null &&
                typeof arg === "object" &&
                typeof arg.formAction === "string";
        }

        public Add(p: Point) {
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

        protected AddElement(p: Point) {
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

        protected _buffGooglePonter = new Array<Point>();
        /**
         * マシンパフォーマンスが低い場合は、一括でやるほうも検討する
         * @param p
         */
        protected AddGoogleSearch(p: Point) {
            if (100 < this._buffGooglePonter.length) {
                //子①GoogleFrame（同一オリジンなので、やりやすい）
                let googleWindow = this.GoogleFrame.contentWindow;
                let request = {
                    message: "Position",
                    median: p
                };
                googleWindow.postMessage(JSON.stringify(request), location.origin);

                this._buffGooglePonter = new Array<Point>();
            } else {
                this._buffGooglePonter.push(p);
            }
        }


        protected Increment(id: string, countaier: string) {
            if (!this.Dic[id]) {
                this.Dic[id] = { container: countaier, count: 0 };
            }

            let obj = this.Dic[id];


            if (id == "BackButton") {
                obj.count += 0.5;
            }
            else {
                obj.count += 1;
            }




            console.info(`□${id}`);


            this.Dic[id] = obj;
        }
    }
}