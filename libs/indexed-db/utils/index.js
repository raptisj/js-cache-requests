import { db } from "../config";

const getTransaction = (store) => {
  const transaction = db?.transaction(store, "readwrite");
  const objectStore = transaction?.objectStore(store);

  return {
    add: (payload) => objectStore.add(payload),
    getIndex: (payload) => objectStore.index(payload),
    get: (payload) => objectStore?.get(payload),
    getAll: () => objectStore?.getAll(),
    getObjectStore: () => objectStore,
  };
};

const getCachedArrayData = async (store, id, indexName) => {
  const { getIndex, getObjectStore } = getTransaction(store);

  const index = indexName ? getIndex(indexName) : null;
  const request =
    index && id ? index.openCursor(id) : getObjectStore()?.openCursor();

  // for the edge case where a user deletes a connection manually from the console's Application tab
  if (!request) {
    return [];
  }

  const results = [];

  await new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };

    request.onerror = (error) => reject(error);
  });

  return results;
};

const getSingleCachedResourse = async (store, id) => {
  const { get } = getTransaction(store);
  const request = get(id);

  const data = await new Promise((resolve, reject) => {
    request.onsuccess = async (event) => {
      if (event.target.result) {
        resolve(event.target.result);
      } else {
        resolve(null);
      }
    };

    request.onerror = (error) => reject(error);
  });

  return data;
};

const clearCacheData = (store) => {
  const transaction = db.transaction(store, "readwrite");

  transaction.oncomplete = () => {
    console.log("DB cleared");
  };

  const objectStore = transaction.objectStore(store);
  objectStore.clear();
};

export const indexedDb = {
  getTransaction,
  getCachedArrayData,
  getSingleCachedResourse,
  clearCacheData,
};
