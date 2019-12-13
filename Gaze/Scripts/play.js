var Gaze;
(function (Gaze) {
    class PlayView {
        Bind() {
            let urlParams = new URLSearchParams(window.location.search);
            let v = urlParams.get("v");
            let iframe = document.getElementById("ytplayer");
            if (iframe) {
                iframe.src = `https://www.youtube.com/embed/${v}?autoplay=1`;
                iframe.width = "100%";
                let buttons = document.getElementById("_buttnos");
                if (buttons) {
                    iframe.height = `${window.screen.height - ($(buttons).height() + 150)}px`;
                }
                //iframe.height = `${window.screen.height - 300}px`;
            }
            let pause = document.getElementById("_pause");
            if (pause) {
                pause.onclick = e => {
                    this.SendCommand("pauseVideo");
                };
            }
            let play = document.getElementById("_play");
            if (play) {
                play.onclick = e => {
                    this.SendCommand("playVideo");
                };
            }
        }
        SendCommand(command) {
            let iframe = document.getElementById("ytplayer");
            iframe.contentWindow.postMessage('{"event":"command","func":"' + command + '","args":""}', '*');
        }
    }
    Gaze.PlayView = PlayView;
    class PlayViewModel {
    }
    Gaze.PlayViewModel = PlayViewModel;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=play.js.map