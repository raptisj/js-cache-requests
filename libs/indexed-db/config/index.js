export let db;
let request;

/**
  @param connectionName: "js-cache-requests",
  @param version: 1,
  @param stores: [
    {
      @param name: "comments",
      @param keyPath: "id",
      @param index: "postId",
    },
  ],
 * 
 */

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

  request.onsuccess = (event) => {
    db = event.target.result;
    console.log("IndexedDB: connection established!");
  };

  request.onerror = (event) => {
    console.log(event, "Something went wrong");
  };

  return STORAGE_STRATEGY;
};

const buildStores = (_db, stores) => {
  stores.map((s) => {
    const store = _db.createObjectStore(s.name, { keyPath: s.keyPath });

    if (s.index) {
      store.createIndex(s.index, s.index);
    }
  });

  return;
};
