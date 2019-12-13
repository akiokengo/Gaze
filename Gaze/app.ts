namespace Gaze {

    /**
     * dom とのイベント紐付けの役割クラス
     * */
    export class IndexView {
        public ViewModel: IndexViewModel;
        public Bind() {
            this.ViewModel = new IndexViewModel();

            let restartButton = document.getElementById("ReStartButton");
            if (restartButton) {
                restartButton.onclick = e => {
                    this.ViewModel.InvokeRestart();
                };
            }

            let closeBtn = document.getElementById("closeBtn");
            if (closeBtn) {
                closeBtn.onclick = e => {

                };
            }
        }
    }


    /**
     * ロジッククラス
     * */
    export class IndexViewModel {
        public InvokeRestart() {
            Restart();
        }

    }


}
