export let cacheDB;

/**
 * @param connectionName: 'my-cache'
 */

const STORAGE_STRATEGY = "cache_api";
export const initCacheAPI = async (options = {}) => {
  const { connectionName } = options;

  if (!connectionName) {
    throw Error("Please provide a connection name.");
  }

  if ("caches" in window) {
    console.log("Cache API: conection established");
    cacheDB = await caches.open(connectionName);

    return STORAGE_STRATEGY;
  } else {
    console.log("Cache API is not supported");
  }
};
