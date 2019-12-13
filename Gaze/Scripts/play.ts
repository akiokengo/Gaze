namespace Gaze {
    export class PlayView {
        public Bind() {
            let urlParams = new URLSearchParams(window.location.search);
            let v = urlParams.get("v");

            let iframe = document.getElementById("ytplayer") as HTMLIFrameElement;
            if (iframe) {
                iframe.src = `https://www.youtube.com/embed/${v}?autoplay=1`;
                iframe.width = `${window.screen.width * 0.8}px`;
                iframe.height = `${window.screen.height * 0.8}px`;
            }
        }
    }

    export class PlayViewModel {

    }
}