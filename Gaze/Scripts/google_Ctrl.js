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