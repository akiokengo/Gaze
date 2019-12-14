var Gaze;
(function (Gaze) {
    class Webgazerview {
        Bind() {
            this.Viewmodel = new Webgazerviewmodel();
            let searchbtn = document.getElementById("Search");
            let learnbtn = document.getElementById("learn");
            let forwardButton = document.getElementById("ForwardButton");
            let backButton = document.getElementById("BackButton");
            let resumeButton = document.getElementById("ResumeButton");
            let scrollupbtn = document.getElementById("Scrollup");
            let scrolldownbtn = document.getElementById("Scrolldown");
            if (searchbtn) {
                searchbtn.onclick = e => {
                    location.href = "webgazer.html";
                };
            }
            if (learnbtn) {
                learnbtn.onclick = e => {
                    location.href = "index.html?b=true";
                };
            }
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
                };
            }
            if (scrolldownbtn) {
                scrolldownbtn.onclick = e => {
                    let frame = document.getElementById("_frameSearch");
                    frame.scrollBy(0, 100);
                };
            }
            if (scrollupbtn) {
                scrolldownbtn.onclick = e => {
                    let frame = document.getElementById("_frameSearch");
                    frame.scrollBy(0, -100);
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
                    let word = encodeURIComponent(t.value);
                    if (e.data == "search") {
                        this.Viewmodel.search(word);
                    }
                    else {
                        this.Viewmodel.feeling(word);
                    }
                }, false);
            }
            if (forwardButton) {
                forwardButton.onclick = e => {
                    try {
                        let history = searchFrame.contentWindow.history;
                        searchFrame.contentWindow.history.forward();
                    }
                    catch (e) {
                    }
                };
            }
            if (backButton) {
                backButton.onclick = e => {
                    try {
                        let history = searchFrame.contentWindow.history;
                        searchFrame.contentWindow.history.back();
                    }
                    catch (e) {
                        location.href = 'webgazer.html';
                    }
                };
            }
            this.Viewmodel.UpdateDom = x => {
                googleFrame.hidden = true;
                searchFrame.hidden = false;
                let arr = x.split('<a href="/url?q=');
                let uri = arr.join(`<a href="${location.origin}/url?q=`);
                //x = x.replace('<a href="/url?q=', `<a href="${location.origin}/url?q=`,)
                searchFrame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(uri);
            };
            let wnd = window;
            wnd.SpeechRecognition = wnd.webkitSpeechRecognition || wnd.SpeechRecognition;
            let recognition = new wnd.SpeechRecognition();
            recognition.lang = 'ja-JP';
            recognition.continuous = true;
            recognition.onresult = e => {
                let result = e.results[e.results.length - 1];
                this.Speech2Text(result[0].transcript);
            };
            recognition.start();
        }
        Speech2Text(text) {
            let googleFrame = document.getElementById("_frame");
            let w = googleFrame.contentWindow;
            let d = googleFrame.contentWindow.document;
            let t = d.getElementById("searchWord");
            t.value = text;
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