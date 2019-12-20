namespace Gaze {



    export class Webgazerview {

        public Viewmodel: Webgazerviewmodel;
        public Bind() {
            this.Viewmodel = new Webgazerviewmodel();
            let searchbtn = document.getElementById("Search");
            let searchbtn2 = document.getElementById("Searchbtn")
            let learnbtn = document.getElementById("learn");
            let forwardButton = document.getElementById("ForwardButton");
            let backButton = document.getElementById("BackButton");
            let resumeButton = document.getElementById("ResumeButton") as HTMLInputElement;
            let strdel = document.getElementById("Strdelbtn");

            if (searchbtn) {
                searchbtn.onclick = e => {
                    location.href = "webgazer.html";
                }
            }
            if (learnbtn) {
                learnbtn.onclick = e => {
                    location.href = "index.html?b=true";


                }
            }

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
                    } else if (e.data == "feeling") {
                        this.Viewmodel.feeling(word);
                    }
                }, false);

                if (searchbtn2) {
                    searchbtn2.onclick = e => {
                        let request = {
                            message: "search",
                        };
                        let json = JSON.stringify(request);
                        w.postMessage(json, location.origin);
                    }

                }

                if (strdel) {
                    strdel.onclick = e => {
                        let request = {
                            message: "clear",

                        };
                        let json = JSON.stringify(request);
                        w.postMessage(json, location.origin);

                    }

                }


            }
            if (forwardButton) {
                forwardButton.onclick = e => {
                    try {
                        let history = searchFrame.contentWindow.history;
                        searchFrame.contentWindow.history.forward();
                    } catch (e) {

                    }

                }
            }
            if (backButton) {
                backButton.onclick = e => {
                    try {
                        let history = searchFrame.contentWindow.history;
                        searchFrame.contentWindow.history.back();
                    } catch (e) {
                        location.href = 'webgazer.html';
                    }

                }
            }
            this.Viewmodel.UpdateDom = x => {

                googleFrame.hidden = true;
                searchFrame.hidden = false;
                let arr = x.split('<a href="/url?q=');
                let html = arr.join(`<a href="${location.origin}/url?q=`);
                //x = x.replace('<a href="/url?q=', `<a href="${location.origin}/url?q=`,)
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, "text/html");



                let newScript = document.createElement("script");
                let inlineScript = document.createTextNode(this.GenerateScript());
                newScript.appendChild(inlineScript);
                // 
                doc.body.appendChild(newScript);

                let newHtml = doc.documentElement.innerHTML;

                searchFrame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(newHtml);

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

        protected GenerateScript() {
            return `
            function NewUid() {
                let uuid = "", i, random;
                for (i = 0; i < 32; i++) {
                    random = Math.random() * 16 | 0;
                    if (i == 8 || i == 12 || i == 16 || i == 20) {
                        uuid += "-";
                    }
                    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
                }
                return uuid;
            }
            window.addEventListener("message", e => {
                if (!e.data) {
                    return;
                }
                let request = JSON.parse(e.data);
                if (!request) {
                    return;
                }
                if (request.message == "ParseScroll") {
                    let scrollingElement = document.scrollingElement;
                    let clientHeight = scrollingElement.clientHeight;
                    let clientWidth = scrollingElement.clientWidth;
                    if (clientHeight == 0 || clientWidth == 0) {
                        return;
                    }
                    let h = scrollingElement.scrollHeight;
                    let w = scrollingElement.scrollWidth;
                    // ディスプレイの↓ばかりみてた場合
                    if ((clientHeight - 300) < request.scrollMedian.Y) {
                        scrollingElement.scrollTop += 100;
                    
                    else if (request.scrollMedian.Y < 200) {
                        // ↑ばかりみてた場合
                        scrollingElement.scrollTop -= 100;
                    }
                }
                if (request.message == "Position") {
                    let el = document.elementFromPoint(request.median.X, request.median.Y);
                    if (el) {
                        // 要素にIDが降られていなければ
                        if (!el.id) {
                            // 一意な文字列を割り当てる
                            el.id = NewUid();
                        }
                        let response = {
                            message: "RePosition-2",
                            id: el.id,
                        };
                        // 送信先に返信する
                        let w = e.source;
                        if (w) {
                            w.postMessage(JSON.stringify(response), e.origin);
                        }
                    }
                }

            });
`;
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