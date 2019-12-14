namespace Gaze {


    export class DotElementParser {
        protected Dic: { [key: string]: number } = {};
        protected Threshold: number;
        protected IsValid = false;
        protected get Doc(): Document {
            let frame = $("#_frame")[0] as HTMLIFrameElement;
            return frame.contentWindow.document;
        }
        constructor(msec: number, threshold: number) {
            this.Threshold = threshold;

            // IFrame上のDocumentを取得する
            let f = $("#_frame");
            if (f.length == 0) {
                return;
            }

            this.IsValid = true;

            // 指定時間経過後に、判定
            setInterval(() => {
                this.Parse();
            }, msec);

        }


        /**
         * 視線をもとに、処理を実装する
         * */
        protected Parse() {
            let tuples = new Array<{}>();
            for (var key in this.Dic)
                tuples.push([key, this.Dic[key]]);

            tuples.sort(function (a, b) {
                a = a[1];
                b = b[1];
                return a < b ? -1 : (a > b ? 1 : 0);
            });

            tuples = tuples.reverse();

            for (var i = 0; i < tuples.length; i++) {
                let key: string = tuples[i][0];
                let value: number = tuples[i][1];

                // 指定した閾値を超える場合
                if (this.Threshold < value) {
                    let element = this.Doc.getElementById(key);
                    if (!element) {
                        element = document.getElementById(key);
                    }

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

            // 親要素と、子要素のどちらも探す。まずは親
            let el = document.elementFromPoint(p.X, p.Y);
            if (el) {
                // 要素にIDが降られていなければ
                if (String.IsNullOrWhiteSpace(el.id)) {
                    // 一意な文字列を割り当てる
                    el.id = this.NewUid();
                }
                if (!this.Dic[el.id]) {
                    this.Dic[el.id] = 0;
                }
                this.Dic[el.id] += 1;
            }

            //子
            el = this.Doc.elementFromPoint(p.X, p.Y);
            if (el) {
                // 要素にIDが降られていなければ
                if (String.IsNullOrWhiteSpace(el.id)) {
                    // 一意な文字列を割り当てる
                    el.id = this.NewUid();
                }
                if (!this.Dic[el.id]) {
                    this.Dic[el.id] = 0;
                }
                this.Dic[el.id] += 1;
            }
        }

        // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        // https://gist.github.com/jcxplorer/823878
        protected NewUid(): string {
            let uuid = "", i, random;
            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i == 8 || i == 12 || i == 16 || i == 20) {
                    uuid += "-"
                }
                uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
            }
            return uuid;
        }

        /*
         *スクロールメソッドの定義
         * sclolldown:下にスクロール
         * sclollup:上にスクロール
         * */
        public scrolldown(): void {
            let frame = document.getElementById("_frameSearch");
            frame.scrollBy(0, 100);
           
        }
        public scrollup(): void {
            let frame = document.getElementById("_frameSearch");
            frame.scrollBy(0, -100);
        }
    }
}