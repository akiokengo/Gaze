var Gaze;
(function (Gaze) {
    class DotElementParser {
        constructor(msec, threshold) {
            this.Dic = {};
            this.IsValid = false;
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
        get Doc() {
            let frame = $("#_frame")[0];
            return frame.contentWindow.document;
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
            for (var i = 0; i < tuples.length; i++) {
                var key = tuples[i][0];
                var value = tuples[i][1];
            }
        }
        Add(p) {
            if (!this.IsValid) {
                return;
            }
            let el = this.Doc.elementFromPoint(p.X, p.Y);
            // 何も取得できなければ抜ける
            if (!el) {
                return;
            }
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
        // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
        // https://gist.github.com/jcxplorer/823878
        NewUid() {
            let uuid = "", i, random;
            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i == 8 || i == 12 || i == 16 || i == 20) {
                    uuid += "-";
                }
                uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
            }
            return uuid;
        }
    }
    Gaze.DotElementParser = DotElementParser;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=DotElementParser.js.map