namespace Gaze {
    export class PlayView {
        public Bind() {
            let urlParams = new URLSearchParams(window.location.search);
            let v = urlParams.get("v");

            let iframe = document.getElementById("ytplayer") as HTMLIFrameElement;
            if (iframe) {
                iframe.src = `https://www.youtube.com/embed/${v}?autoplay=1`;
                iframe.width = "100%";

                let buttons = document.getElementById("_buttnos") as HTMLIFrameElement;
                if (buttons) {
                    iframe.height = `${window.screen.height - ($(buttons).height() + 150)}px`;
                }

                //iframe.height = `${window.screen.height - 300}px`;

            }

            let pause = document.getElementById("_pause") as HTMLButtonElement;
            if (pause) {
                pause.onclick = e => {
                    this.SendCommand("pauseVideo");
                };
            }

            let play = document.getElementById("_play") as HTMLButtonElement;
            if (play) {
                play.onclick = e => {
                    this.SendCommand("playVideo");
                };
            }

        }

        protected SendCommand(command: string) {
            let iframe = document.getElementById("ytplayer") as HTMLIFrameElement;
            iframe.contentWindow.postMessage('{"event":"command","func":"' + command + '","args":""}', '*');
        }
    }

    export class PlayViewModel {

    }
}