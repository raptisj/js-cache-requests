import { db } from "../config/initIndexedDB";

export const getTransaction = (store) => {
  const transaction = db.transaction([store], "readwrite");
  const objectStore = transaction.objectStore(store);

  return {
    add: (payload) => objectStore.add(payload),
    getIndex: (payload) => objectStore.index(payload),
    get: (payload) => objectStore.get(payload),
  };
};
