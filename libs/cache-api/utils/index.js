import { cacheDB } from "../config";

export const getTransaction = async (key) => {
  const response = await cacheDB.match(key);

  if (response) {
    return await response.json();
  }

  return response;
};

export const storeResource = (key) => {
  const response = cacheDB.add(key);

  return response;
};

export const getSingleResource = async (id, allKey, key) => {
  const allUserResponse = await cacheDB.match(allKey);

  if (allUserResponse) {
    const cachedUsers = await allUserResponse.json();
    const user = cachedUsers.find((u) => u.id === id);

    return user;
  }

  const singleUserResponse = await cacheDB.match(key);
  if (singleUserResponse) {
    const user = await singleUserResponse.json();

    return user;
  }

  return null;
};

export const clearCacheData = async (store) => {
  const cacheKeys = await cacheDB.keys();

  cacheKeys.forEach((req) => {
    if (req.url.includes(`/${store}`)) {
      cacheDB.delete(req.url);
    }
  });
};
