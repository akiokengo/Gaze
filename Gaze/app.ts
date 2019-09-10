window.onload = () => {
    let view = new Gaze.IndexView();
    view.Bind();
};


namespace Gaze {

    /**
     * dom とのイベント紐付けの役割クラス
     * */
    export class IndexView {
        public ViewModel: IndexViewModel;
        public Bind() {
            this.ViewModel = new IndexViewModel();


   
            let pauseButton = document.getElementById("PauseButton");
            pauseButton.onclick = e => {
                this.ViewModel.Pause();
            };

            let resumeButton = document.getElementById("ResumeButton");
            resumeButton.onclick = e => {
                this.ViewModel.Resume();
            };






        }
    }


    /**
     * ロジッククラス
     * */
    export class IndexViewModel {
        public Pause() {

        }
        public Resume() {

        }

    }


}
