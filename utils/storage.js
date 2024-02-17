export const getStorageLimit = (strategy) => {
  switch (strategy) {
    case "local_storage":
      return 5;
    case "indexed_db":
      return 10;
    case "cache_api":
      return 10;
    default:
      return 10;
  }
};

// Divide the raw value by 1024 twice to convert it from bytes to megabytes.
export const bytesToMegabytes = (estimate) =>
  Math.floor((estimate.quota - estimate.usage) / 1024 / 1024);
