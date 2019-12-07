function Savelz(lz: string) {
    let helper = new Gaze.IndexedDBHelper<Gaze.lzString>(Gaze.lzString, "db");

    let model = new Gaze.lzString();
    model.ID = 0;
    model.Compress = lz;

    // 非同期での更新を実施し、その非同期オブジェクトをそのまま返す
    return helper.UpsertAsync(model, "ID");
}


function LoadAsync() {
    let dfd = $.Deferred();
    let helper = new Gaze.IndexedDBHelper<Gaze.lzString>(Gaze.lzString, "db");
    // データが読み込めた場合は、圧縮状態から復元し、JSON文字列をオブジェクト化して返す
    helper.FindRowAsync("ID", 0)
        .fail(() => {
            dfd.reject({});
        })
        .then(x => {
            if (x) {
                let json = LZString.decompress(x.Compress);
                dfd.resolve(JSON.parse(json));
            }
            dfd.reject({});
        });
    return dfd.promise();
}