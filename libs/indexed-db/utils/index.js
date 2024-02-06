import { db } from "../config";

export const getTransaction = (store) => {
  const transaction = db?.transaction(store, "readwrite");
  const objectStore = transaction?.objectStore(store);

  return {
    add: (payload) => objectStore.add(payload),
    getIndex: (payload) => objectStore.index(payload),
    get: (payload) => objectStore?.get(payload),
    getAll: () => objectStore?.getAll(),
  };
};

export const getCachedData = async (store) => {
  const { getAll } = getTransaction(store);
  const request = getAll();
  let isEmpty = false;

  if (!request) {
    return false;
  }

  isEmpty = await new Promise((resolve, reject) => {
    request.onsuccess = async (event) => {
      if (!event.target.result.length) {
        resolve(false);
      } else {
        resolve(true);
      }
    };

    request.onerror = (error) => reject(error);
  });

  return isEmpty;
};

export const getCachedArrayData = async (store, id, indexName) => {
  const { getIndex } = getTransaction(store);

  const index = getIndex(indexName);
  const request = index.openCursor(id);

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

export const getSingleCachedResourse = async (store, id) => {
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

export const clearCacheData = (store) => {
  const transaction = db.transaction(store, "readwrite");

  transaction.oncomplete = () => {
    console.log("DB cleared");
  };

  const objectStore = transaction.objectStore(store);
  objectStore.clear();
};
