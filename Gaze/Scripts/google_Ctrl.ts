namespace Gaze {
    /** 型セーフにコーディングする */
    export class google_CtrlView {
        public ViewModel: google_CtrlViewModel;
        public Bind() {
            this.ViewModel = new google_CtrlViewModel();
            var btn1b = document.getElementById('searchButton');
            if (btn1b) {
                btn1b.onclick = e => this.ViewModel.searchAction();
            }
        }
    }


    export class google_CtrlViewModel {
        public searchAction() {
            alert('検索ボタンが押されました');
        }
    }
}
