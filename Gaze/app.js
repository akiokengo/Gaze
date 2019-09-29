window.addEventListener('onload', function () {
    var view = new Gaze.IndexView();
    view.Bind();
});
var Gaze;
(function (Gaze) {
    var IndexView = (function () {
        function IndexView() {
        }
        IndexView.prototype.Bind = function () {
            var _this = this;
            this.ViewModel = new IndexViewModel();
            var pauseButton = document.getElementById("PauseButton");
            pauseButton.onclick = function (e) {
                _this.ViewModel.Pause();
            };
            var resumeButton = document.getElementById("ResumeButton");
            resumeButton.onclick = function (e) {
                _this.ViewModel.Resume();
            };
        };
        return IndexView;
    }());
    Gaze.IndexView = IndexView;
    var IndexViewModel = (function () {
        function IndexViewModel() {
        }
        IndexViewModel.prototype.Pause = function () {
        };
        IndexViewModel.prototype.Resume = function () {
        };
        return IndexViewModel;
    }());
    Gaze.IndexViewModel = IndexViewModel;
})(Gaze || (Gaze = {}));
