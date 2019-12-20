function Savelz(lz) {
    let helper = new Gaze.IndexedDBHelper(Gaze.lzString, "db");
    let model = new Gaze.lzString();
    model.ID = 0;
    model.Compress = lz;
    // 非同期での更新を実施し、その非同期オブジェクトをそのまま返す
    return helper.UpsertAsync(model, "ID");
}
function LoadAsync() {
    let dfd = $.Deferred();
    let helper = new Gaze.IndexedDBHelper(Gaze.lzString, "db");
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
function clearIndexDBAsync() {
    let dfd = $.Deferred();
    let helper = new Gaze.IndexedDBHelper(Gaze.lzString, "db");
    dfd.resolve();
    //helper.Truncate().always(() => {
    //    dfd.resolve();
    //});
    return dfd.promise();
}
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
// https://gist.github.com/jcxplorer/823878
function NewUid() {
    let uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;
        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-";
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}
function GetUserMedia(max, constraints) {
    let dfd = $.Deferred();
    GetUserMediaRecusive(constraints)
        .done(x => {
        dfd.resolve(x);
    }).fail((x) => {
        if (x == 0) {
            dfd.reject("読み込めませんでした");
        }
        else {
            GetUserMedia(x - 1, constraints)
                .done(y => {
                dfd.resolve(y);
            }).fail(y => {
                dfd.reject("読み込めませんでした");
            });
        }
    });
    return dfd.promise();
}
function GetUserMediaRecusive(constraints) {
    let dfd = $.Deferred();
    navigator.mediaDevices.getUserMedia(constraints).then(x => {
        dfd.resolve(x);
    }).catch(x => {
        dfd.reject(x);
    });
    return dfd.promise();
}
//# sourceMappingURL=polifil.js.map