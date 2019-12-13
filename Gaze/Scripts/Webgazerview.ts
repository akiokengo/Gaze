namespace Gaze {



    export class Webgazerview {

        public Viewmodel: Webgazerviewmodel;
        public Bind() {
            this.Viewmodel = new Webgazerviewmodel();

            let forwardButton = document.getElementById("ForwardButton");
            let backButton = document.getElementById("BackButton");
            let resumeButton = document.getElementById("ResumeButton") as HTMLInputElement;
            if (forwardButton) {
                forwardButton.onclick = e => {
                    window.history.forward();
                }
            }
            if (backButton) {
                backButton.onclick = e => {
                    window.history.back();
                }
            }
            if (resumeButton) {
                resumeButton.onclick = e => {
                    if (resumeButton.value == "機能停止") {
                        resumeButton.value = "機能再開";
                    }
                    else {
                        resumeButton.value = "機能停止";
                    }

                }
            }

            let searchFrame = document.getElementById("_frameSearch") as HTMLIFrameElement;
            if (searchFrame) {
                searchFrame.hidden = true;
            }
            let googleFrame = document.getElementById("_frame") as HTMLIFrameElement;

            if (googleFrame) {
                let w = googleFrame.contentWindow;
                let d = googleFrame.contentWindow.document;

                w.addEventListener("message", e => {
                    let t = d.getElementById("searchWord") as HTMLInputElement;
                    let word = encodeURIComponent(t.value);
                    if (e.data == "search") {
                        this.Viewmodel.search(word);
                    } else {
                        this.Viewmodel.feeling(word);
                    }
                }, false);
            }

            this.Viewmodel.UpdateDom = x => {

                googleFrame.hidden = true;
                searchFrame.hidden = false;
                let arr = x.split('<a href="/url?q=');
                let uri = arr.join(`<a href="${location.origin}/url?q=`);
                //x = x.replace('<a href="/url?q=', `<a href="${location.origin}/url?q=`,)

                searchFrame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(uri);

            };

            let wnd: any = window;
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

        public Speech2Text(text: string) {
            let googleFrame = document.getElementById("_frame") as HTMLIFrameElement;
            let w = googleFrame.contentWindow;
            let d = googleFrame.contentWindow.document;
            let t = d.getElementById("searchWord") as HTMLInputElement;
            t.value = text;
        }

    }


    export class Webgazerviewmodel {

        public UpdateDom: (x: string) => void;

        public search(word: string) {
            let uri = "https://gazefunctions.azurewebsites.net/search?q=" + word;
            this.Get(uri).done((x: string) => {
                this.UpdateDom(x);
            });
        }
        public feeling(word: string) {
            let uri = "https://gazefunctions.azurewebsites.net/search?q=" + word;
            this.Get(uri).done((x: string) => {
                this.UpdateDom(x);
            });
        }

        protected Get(url: string) {
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
}