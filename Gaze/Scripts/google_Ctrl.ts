namespace Gaze {
    /** 型セーフにコーディングする */
    export class google_CtrlView {
        public ViewModel: google_CtrlViewModel;
        public Bind() {
            this.ViewModel = new google_CtrlViewModel();

            let btn1b = document.getElementById('searchButton');
            if (btn1b) {
                btn1b.onclick = e => this.ViewModel.searchAction();
            }

            let btn2b = document.getElementById("feelingButton");
            if (btn2b) {
                btn2b.onclick = e => this.ViewModel.feelingAction();
            }

            

            let input = document.getElementById("searchWord") as HTMLInputElement;
            if (input) {
                this.ViewModel.searchWord = () => input.value;
            }
        }
    }


    export class google_CtrlViewModel {
        public searchWord: () => string;
        public PostMessage: (dom: string) => void;
        public searchAction() {
            let value = this.searchWord();

            // 空白だったら、何もしない
            if (String.IsNullOrWhiteSpace(value)) {
                return;
            }

            // 空白をサマリ
            value = value.replace(/\s+/g, " ");
            window.postMessage("search", location.origin)
        }

        public feelingAction() {
            let value = this.searchWord();

            // 空白だったら、何もしない
            if (String.IsNullOrWhiteSpace(value)) {
                return;
            }

            // 空白をサマリ
            value = value.replace(/\s+/g, " ");
            window.postMessage("feeling", location.origin)
        }
    }
}
