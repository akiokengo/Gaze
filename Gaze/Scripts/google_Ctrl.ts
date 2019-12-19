namespace Gaze {
    /** 型セーフにコーディングする */
    export class google_CtrlView {
        public ViewModel: google_CtrlViewModel;
        public Bind() {
            this.ViewModel = new google_CtrlViewModel();

            let btn1b = document.getElementById('Searchbtn');
            if (btn1b) {
                btn1b.onclick = e => this.ViewModel.searchAction();
            }

            let btn2b = document.getElementById("feelingButton");
            if (btn2b) {
                btn2b.onclick = e => this.ViewModel.feelingAction();
            }

            let input = document.getElementById("searchWord") as HTMLInputElement;
            if (input) {
                this.ViewModel.searchWord = () => input.value;
            }


            window.addEventListener("message", e => {
                if (!e.data) {
                    return;
                }

                let request: {
                    message: string,
                    median?: {
                        X: number,
                        Y: number
                    },
                    id?; string
                } = JSON.parse(e.data);

                if (!request) {
                    return;
                }

                if (request.message == "Position") {
                    let el = document.elementFromPoint(request.median.X, request.median.Y);
                    if (el) {
                        // 要素にIDが降られていなければ
                        if (String.IsNullOrWhiteSpace(el.id)) {
                            // 一意な文字列を割り当てる
                            el.id = NewUid();
                        }

                        let response = {
                            message: "RePosition-1",
                            id: el.id,
                        };

                        // 送信先に返信する
                        let w = e.source as Window;
                        if (w) {
                            w.postMessage(JSON.stringify(response), e.origin);
                        }
                    }
                }
            });
        }
    }


    export class google_CtrlViewModel {
        public searchWord: () => string;
        public PostMessage: (dom: string) => void;
        public searchAction() {
            let value = this.searchWord();

            // 空白だったら、何もしない
            if (String.IsNullOrWhiteSpace(value)) {
                return;
            }

            // 空白をサマリ
            value = value.replace(/\s+/g, " ");
            window.postMessage("search", location.origin)
        }

        public feelingAction() {
            let value = this.searchWord();

            // 空白だったら、何もしない
            if (String.IsNullOrWhiteSpace(value)) {
                return;
            }

            // 空白をサマリ
            value = value.replace(/\s+/g, " ");
            window.postMessage("feeling", location.origin)
        }
    }
}
