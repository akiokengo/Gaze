function Savelz(lz: String) {
    let helper = new Gaze.IndexedDBHelper<Gaze.lzString>(Gaze.lzString, "db");

    let model = new Gaze.lzString();
    model.ID = 0;
    model.Compress = lz;

    // 非同期での更新を実施し、その非同期オブジェクトをそのまま返す
    return helper.UpsertAsync(model, "ID");
}