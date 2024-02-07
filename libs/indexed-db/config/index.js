export let db;
let request;

const STORAGE_STRATEGY = "indexed_db";
export const initIndexedDB = async (options = {}) => {
  const { connectionName, version, stores } = options;

  if ("indexedDB" in window) {
    request = indexedDB.open(connectionName, version);
  } else {
    db = null;
    request = null;

    console.log("Your browser does not support IndexedDB.");
  }

  request.onupgradeneeded = (event) => {
    const db = event.target.result;

    buildStores(db, stores);
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("IndexedDB: connection established!");
  };

  request.onerror = function (event) {
    console.log(event, "Something went wrong");
  };

  return STORAGE_STRATEGY;
};

const buildStores = (_db, stores) => {
  stores.map((s) => {
    let store = _db.createObjectStore(s.name, { keyPath: s.keyPath });

    if (s.index) {
      store.createIndex(s.index, s.index);
    }
  });

  return;
};
