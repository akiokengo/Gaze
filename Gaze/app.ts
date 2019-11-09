namespace Gaze {

    /**
     * dom とのイベント紐付けの役割クラス
     * */
    export class IndexView {
        public ViewModel: IndexViewModel;
        public Bind() {
            this.ViewModel = new IndexViewModel();

            let restartButton = document.getElementById("ReStartButton");

            restartButton.onclick = e => {
                this.ViewModel.InvokeRestart();
            };
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
