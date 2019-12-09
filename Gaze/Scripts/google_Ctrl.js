var Gaze;
(function (Gaze) {
    /** 型セーフにコーディングする */
    class google_CtrlView {
        Bind() {
            this.ViewModel = new google_CtrlViewModel();
            var btn1b = document.getElementById('searchButton');
            if (btn1b) {
                btn1b.onclick = e => this.ViewModel.searchAction();
            }
        }
    }
    Gaze.google_CtrlView = google_CtrlView;
    class google_CtrlViewModel {
        searchAction() {
            alert('検索ボタンが押されました');
        }
    }
    Gaze.google_CtrlViewModel = google_CtrlViewModel;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=google_Ctrl.js.map