export let cacheDB;

if ("caches" in window) {
  console.log("Cache API is supported");
  cacheDB = await caches.open("new-cache");
}
