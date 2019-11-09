var Gaze;
(function (Gaze) {
    /**
     * dom とのイベント紐付けの役割クラス
     * */
    var IndexView = /** @class */ (function () {
        function IndexView() {
        }
        IndexView.prototype.Bind = function () {
            var _this = this;
            this.ViewModel = new IndexViewModel();
            var restartButton = document.getElementById("ReStartButton");
            if (restartButton) {
                restartButton.onclick = function (e) {
                    _this.ViewModel.InvokeRestart();
                };
            }
        };
        return IndexView;
    }());
    Gaze.IndexView = IndexView;
    /**
     * ロジッククラス
     * */
    var IndexViewModel = /** @class */ (function () {
        function IndexViewModel() {
        }
        IndexViewModel.prototype.InvokeRestart = function () {
            Restart();
        };
        return IndexViewModel;
    }());
    Gaze.IndexViewModel = IndexViewModel;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=app.js.map