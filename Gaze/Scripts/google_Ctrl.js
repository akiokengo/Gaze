var Gaze;
(function (Gaze) {
    /** 型セーフにコーディングする */
    class google_CtrlView {
        Bind() {
            this.ViewModel = new google_CtrlViewModel();
            let btn1b = document.getElementById('searchButton');
            if (btn1b) {
                btn1b.onclick = e => this.ViewModel.searchAction();
            }
            let btn2b = document.getElementById("feelingButton");
            if (btn2b) {
                btn2b.onclick = e => this.ViewModel.feelingAction();
            }
            let input = document.getElementById("searchWord");
            if (input) {
                this.ViewModel.searchWord = () => input.value;
            }
            window.addEventListener("message", e => {
                if (!e.data) {
                    return;
                }
                let request = JSON.parse(e.data);
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
                        // 送信先に変身する
                        window.postMessage(JSON.stringify(response), e.origin);
                    }
                }
            });
        }
    }
    Gaze.google_CtrlView = google_CtrlView;
    class google_CtrlViewModel {
        searchAction() {
            let value = this.searchWord();
            // 空白だったら、何もしない
            if (String.IsNullOrWhiteSpace(value)) {
                return;
            }
            // 空白をサマリ
            value = value.replace(/\s+/g, " ");
            window.postMessage("search", location.origin);
        }
        feelingAction() {
            let value = this.searchWord();
            // 空白だったら、何もしない
            if (String.IsNullOrWhiteSpace(value)) {
                return;
            }
            // 空白をサマリ
            value = value.replace(/\s+/g, " ");
            window.postMessage("feeling", location.origin);
        }
    }
    Gaze.google_CtrlViewModel = google_CtrlViewModel;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=google_Ctrl.js.map