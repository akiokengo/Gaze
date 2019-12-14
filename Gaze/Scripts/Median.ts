namespace Gaze {


    export interface Point {
        X: number;
        Y: number;
    }

    /**
     * 座標から中央値を返すコードをTypeScriptでコードする
     * */
    export class Median {

        protected Queue = new Array<Point>();
        protected Threshold: number;
        constructor(threshold: number) {
            this.Threshold = threshold;
        }

        public Generate(x: number, y: number): Point {
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


        protected Parse(arr: number[], half: number) {
            if (arr.length % 2) {
                return arr[half];
            }
            return (arr[half - 1] + arr[half]) / 2;
        }
    }

    export class ScrollMedian {
        protected Queue = new Array<Point>();
        public Add(x: number, y: number) {
            this.Queue.push({ X: x, Y: y });
        }

        public Generate(): Point {
            let half = (this.Queue.length / 2) | 0;
            let xSort = this.Queue.map(p => p.X).sort();
            let ySort = this.Queue.map(p => p.Y).sort();

            let xMedian = this.Parse(xSort, half);
            let yMedian = this.Parse(ySort, half);

            let result = {
                X: xMedian,
                Y: yMedian
            };

            this.Queue = new Array<Point>();
            return result;
        }
        protected Parse(arr: number[], half: number) {
            if (arr.length % 2) {
                return arr[half];
            }
            return (arr[half - 1] + arr[half]) / 2;
        }
    }

}