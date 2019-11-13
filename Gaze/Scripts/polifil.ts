function Savelz(lz: String) {
    let helper = new Gaze.IndexedDBHelper<Gaze.lzString>(Gaze.lzString, "db");

    let model = new Gaze.lzString();
    model.ID = 0;
    model.Compress = lz;

    helper.UpsertAsync(model, "ID");

   let table = helper.FindRowAsync("ID", 0);

//    table.done(x => {
//        let model = x;
//    }).fail(x => {

//    });

}