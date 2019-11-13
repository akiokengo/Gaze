var Gaze;
(function (Gaze) {
    /**
     * dom とのイベント紐付けの役割クラス
     * */
    class IndexView {
        Bind() {
            this.ViewModel = new IndexViewModel();
            let restartButton = document.getElementById("ReStartButton");
            if (restartButton) {
                restartButton.onclick = e => {
                    this.ViewModel.InvokeRestart();
                };
            }
            let closeBtn = document.getElementById("closeBtn");
            if (closeBtn) {
                closeBtn.onclick = e => {
                };
            }
        }
    }
    Gaze.IndexView = IndexView;
    /**
     * ロジッククラス
     * */
    class IndexViewModel {
        InvokeRestart() {
            Restart();
        }
    }
    Gaze.IndexViewModel = IndexViewModel;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=app.js.map