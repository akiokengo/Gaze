var Gaze;
(function (Gaze) {
    class Webgazerviewmodel {
    }
    Gaze.Webgazerviewmodel = Webgazerviewmodel;
    class Webgazerview {
        Bind() {
            this.Viewmodel = new Webgazerviewmodel();
            let forwardButton = document.getElementById("ForwardButton");
            let backButton = document.getElementById("BackButton");
            let resumeButton = document.getElementById("ResumeButton");
            if (forwardButton) {
                forwardButton.onclick = e => {
                    window.history.forward();
                };
            }
            if (backButton) {
                backButton.onclick = e => {
                    window.history.back();
                };
            }
            if (resumeButton) {
                resumeButton.onclick = e => {
                    if (resumeButton.value == "機能停止") {
                        resumeButton.value = "機能再開";
                    }
                    else {
                        resumeButton.value = "機能停止";
                    }
                };
            }
        }
    }
    Gaze.Webgazerview = Webgazerview;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=Webgazerview.js.map