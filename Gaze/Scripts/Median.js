var Gaze;
(function (Gaze) {
    /**
     * 座標から中央値を返すコードをTypeScriptでコードする
     * */
    class Median {
        constructor(threshold) {
            this.Queue = new Array();
            this.Threshold = threshold;
        }
        Generate(x, y) {
            this.Queue.push({ X: x, Y: y });
            if (this.Threshold < this.Queue.length) {
                this.Queue = this.Queue.slice(1);
            }
            let half = (this.Queue.length / 2) | 0;
            let xSort = this.Queue.map(p => p.X).sort();
            let ySort = this.Queue.map(p => p.Y).sort();
            let xMedian = this.Parse(xSort, half);
            let yMedian = this.Parse(ySort, half);
            return {
                X: xMedian,
                Y: yMedian
            };
        }
        Parse(arr, half) {
            if (arr.length % 2) {
                return arr[half];
            }
            return (arr[half - 1] + arr[half]) / 2;
        }
    }
    Gaze.Median = Median;
    class ScrollMedian {
        constructor() {
            this.Queue = new Array();
        }
        Add(x, y) {
            this.Queue.push({ X: x, Y: y });
        }
        Generate() {
            let half = (this.Queue.length / 2) | 0;
            let xSort = this.Queue.map(p => p.X).sort();
            let ySort = this.Queue.map(p => p.Y).sort();
            let xMedian = this.Parse(xSort, half);
            let yMedian = this.Parse(ySort, half);
            let result = {
                X: xMedian,
                Y: yMedian
            };
            this.Queue = new Array();
            return result;
        }
        Parse(arr, half) {
            if (arr.length % 2) {
                return arr[half];
            }
            return (arr[half - 1] + arr[half]) / 2;
        }
    }
    Gaze.ScrollMedian = ScrollMedian;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=Median.js.map