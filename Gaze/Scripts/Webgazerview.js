var Gaze;
(function (Gaze) {
    var Webgazerviewmodel = /** @class */ (function () {
        function Webgazerviewmodel() {
        }
        return Webgazerviewmodel;
    }());
    Gaze.Webgazerviewmodel = Webgazerviewmodel;
    var Webgazerview = /** @class */ (function () {
        function Webgazerview() {
        }
        Webgazerview.prototype.Bind = function () {
            this.Viewmodel = new Webgazerviewmodel();
            var forwardButton = document.getElementById("ForwardButton");
            var backButton = document.getElementById("BackButton");
            var resumeButton = document.getElementById("ResumeButton");
            if (forwardButton) {
                forwardButton.onclick = function (e) {
                    window.history.forward();
                };
            }
            if (backButton) {
                backButton.onclick = function (e) {
                    window.history.back();
                };
            }
            if (resumeButton) {
                resumeButton.onclick = function (e) {
                    if (resumeButton.value == "機能停止") {
                        resumeButton.value = "機能再開";
                    }
                    else {
                        resumeButton.value = "機能停止";
                    }
                };
            }
        };
        return Webgazerview;
    }());
    Gaze.Webgazerview = Webgazerview;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=Webgazerview.js.map