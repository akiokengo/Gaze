var Gaze;
(function (Gaze) {
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
            let searchFrame = document.getElementById("_frameSearch");
            if (searchFrame) {
                searchFrame.hidden = true;
            }
            let googleFrame = document.getElementById("_frame");
            if (googleFrame) {
                let w = googleFrame.contentWindow;
                let d = googleFrame.contentWindow.document;
                w.addEventListener("message", e => {
                    let t = d.getElementById("searchWord");
                    let word = t.value;
                    if (e.data == "search") {
                        this.Viewmodel.search(word);
                    }
                    else {
                        this.Viewmodel.feeling(word);
                    }
                }, false);
            }
            this.Viewmodel.UpdateDom = x => {
                googleFrame.hidden = true;
                searchFrame.hidden = false;
                searchFrame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(x);
            };
        }
    }
    Gaze.Webgazerview = Webgazerview;
    class Webgazerviewmodel {
        search(word) {
            let uri = "https://gazefunctions.azurewebsites.net/search?q=" + word;
            this.Get(uri).done((x) => {
                this.UpdateDom(x);
            });
        }
        feeling(word) {
            let uri = "https://gazefunctions.azurewebsites.net/search?q=" + word;
            this.Get(uri).done((x) => {
                this.UpdateDom(x);
            });
        }
        Get(url) {
            let d = $.Deferred();
            $.ajax({
                type: "GET",
                url: url,
                async: true
            }).done(x => {
                d.resolve(x);
            }).fail(x => {
                d.reject(x);
            });
            return d.promise();
        }
    }
    Gaze.Webgazerviewmodel = Webgazerviewmodel;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=Webgazerview.js.map