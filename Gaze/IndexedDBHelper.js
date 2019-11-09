var Gaze;
(function (Gaze) {
    class IndexedDBHelper {
        constructor(ctor, db) {
            let schema = new ctor();
            let name = schema.toString();
            if (name === "[object Object]") {
                name = schema.constructor.name;
            }
            if (name === "Object") {
                throw Error("dynamic object is not supported");
            }
            this.DbName = db;
            this.TableName = name;
        }
        Drop() {
            let d = $.Deferred();
            let db = this.Open();
            db.done(x => {
                if (!x.objectStoreNames.contains(this.TableName)) {
                    d.resolve();
                    return;
                }
                // 
                this.Upgrade(x.version + 1, y => {
                    let newDb = y.target.result;
                    if (newDb && newDb.deleteObjectStore)
                        newDb.deleteObjectStore(this.TableName);
                    d.resolve();
                });
            }).fail(() => {
                d.reject();
            });
            return d.promise();
        }
        List() {
            let d = $.Deferred();
            let db = this.Open();
            db.done(x => {
                if (!x.objectStoreNames.contains(this.TableName)) {
                    d.resolve([]);
                    return;
                }
                let trans = x.transaction(this.TableName, "readwrite");
                let objectStore = trans.objectStore(this.TableName);
                let dbRequest = objectStore.getAll();
                dbRequest.onsuccess = e => {
                    let result = dbRequest.result;
                    d.resolve(result);
                };
                dbRequest.onerror = e => {
                    d.reject();
                };
            }).fail(() => {
                d.reject();
            });
            return d.promise();
        }
        Truncate() {
            let d = $.Deferred();
            let db = this.Open();
            db.done(x => {
                if (!x.objectStoreNames.contains(this.TableName)) {
                    d.resolve([]);
                    return;
                }
                let trans = x.transaction(this.TableName, "readwrite");
                let objectStore = trans.objectStore(this.TableName);
                let dbRequest = objectStore.clear();
                dbRequest.onsuccess = e => {
                    d.resolve();
                };
                dbRequest.onerror = e => {
                    d.reject();
                };
            }).fail(() => {
                d.reject();
            });
            return d.promise();
        }
        FindRowAsync(path, value) {
            let d = $.Deferred();
            this.FindRowsAsync(path, value).done(x => {
                d.resolve(x.FirstOrDefault());
            }).fail(x => {
                d.reject(x);
            });
            return d.promise();
        }
        FindRowsAsync(path, value) {
            let d = $.Deferred();
            let db = this.Open();
            db.done(x => {
                if (!x.objectStoreNames.contains(this.TableName)) {
                    d.resolve([]);
                    return;
                }
                let trans = x.transaction(this.TableName, "readwrite");
                let objectStore = trans.objectStore(this.TableName);
                if (objectStore.keyPath === path) {
                    let dbRequest = objectStore.get(value);
                    dbRequest.onsuccess = e => {
                        let result = [dbRequest.result];
                        d.resolve(result);
                    };
                    dbRequest.onerror = e => {
                        d.reject(e);
                    };
                }
                else if (objectStore.indexNames.contains(path)) {
                    this.FetchCursor(objectStore.index(path), value, d);
                }
                else {
                    x.close();
                    this.Upgrade(x.version + 1, y => {
                        let newDb = y.target.result;
                        let newTrans = y.target.transaction;
                        let newObjectStore = newTrans.objectStore(this.TableName);
                        let indexStore = newObjectStore.createIndex(path, path, { unique: false });
                        this.FetchCursor(indexStore, value, d);
                    });
                }
            }).fail(x => {
                d.reject(x);
            });
            return d.promise();
        }
        FetchCursor(indexStore, value, d) {
            let list = new Array();
            let cursorHandler = indexStore.openCursor(value);
            cursorHandler.onsuccess = (e) => {
                let cursor = e.target.result;
                if (cursor) {
                    let value = cursor.value;
                    if (!Object.IsNullOrUndefined(value)) {
                        list.push(value);
                    }
                    cursor.continue();
                }
                else {
                    // cursor is end;
                    d.resolve(list);
                }
            };
            cursorHandler.onerror = e => {
                d.reject(e);
            };
        }
        UpsertAsync(entity, primaryKeyPath) {
            let d = $.Deferred();
            let db = this.Open();
            db.done(x => {
                if (!x.objectStoreNames.contains(this.TableName)) {
                    x.close();
                    this.Upgrade(x.version + 1, y => {
                        let newDb = y.target.result;
                        let newStore;
                        if (primaryKeyPath) {
                            newStore = newDb.createObjectStore(this.TableName, { keyPath: primaryKeyPath });
                        }
                        else {
                            newStore = newDb.createObjectStore(this.TableName, { keyPath: "__identity", autoIncrement: true });
                        }
                        // 
                        newStore.transaction.oncomplete = e => {
                            newDb.close();
                            this.UpsertAsync(entity, primaryKeyPath).done(x => d.resolve()).fail(x => d.reject(x));
                        };
                    });
                    return;
                }
                let trans = x.transaction(this.TableName, "readwrite");
                let store = trans.objectStore(this.TableName);
                if (entity instanceof Array) {
                    $.each(entity, (i, value) => {
                        store.put(value);
                    });
                }
                else {
                    store.put(entity);
                }
                d.resolve();
            }).fail(x => {
                d.reject(x);
            });
            return d.promise();
        }
        DeleteAsync(entity) {
            let d = $.Deferred();
            let db = this.Open();
            db.done(x => {
                if (!x.objectStoreNames.contains(this.TableName)) {
                    d.resolve();
                }
                else {
                    let trans = x.transaction(this.TableName, "readwrite");
                    if (trans.objectStoreNames.contains(this.TableName)) {
                        let store = trans.objectStore(this.TableName);
                        if (entity instanceof Array) {
                            $.each(entity, (i, value) => {
                                let id = value[`${store.keyPath}`];
                                store.delete(id);
                            });
                        }
                        else {
                            let identity = entity[`${store.keyPath}`];
                            store.delete(identity);
                        }
                        d.resolve();
                    }
                    else {
                        d.reject(`table not found. ${this.TableName}`);
                    }
                }
            }).fail(x => {
                d.reject(x);
            });
            return d.promise();
        }
        Open() {
            let d = $.Deferred();
            let factory = window.indexedDB;
            let openRequest = factory.open(this.DbName);
            openRequest.onsuccess = e => {
                let db = openRequest.result;
                d.resolve(db);
                db.close();
            };
            openRequest.onblocked = e => {
                d.reject(e);
            };
            openRequest.onerror = e => {
                d.reject(e);
            };
            return d.promise();
        }
        Upgrade(version, action) {
            // let d = $.Deferred<any>();
            let factory = window.indexedDB;
            let openRequest = factory.open(this.DbName, version);
            openRequest.onsuccess = e => {
                let dummy = e;
            };
            openRequest.onupgradeneeded = (e) => {
                let db = e.target.result;
                action(e);
                db.close();
            };
            openRequest.onerror = e => {
            };
        }
    }
    Gaze.IndexedDBHelper = IndexedDBHelper;
})(Gaze || (Gaze = {}));
//# sourceMappingURL=IndexedDBHelper.js.map