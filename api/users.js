import { BASE_URL } from "../constants";

import { cacheApi } from "../libs/cache-api";
import { indexedDb } from "../libs/indexed-db";

const getAllUsersCacheKey = () => `${BASE_URL}/users/`;
const getUserCacheKey = (id) => `${BASE_URL}/users/${id}`;

const fetchUsers = async (options = {}) => {
  const { storageStrategy = "" } = options;

  if (storageStrategy === "cache_api") {
    const response = await cacheApi.storeResource(getAllUsersCacheKey());

    return response;
  }

  const response = await fetch(getAllUsersCacheKey());
  const users = await response.json();

  if (storageStrategy === "indexed_db") {
    const { add } = indexedDb.getTransaction("users");
    users.map((u) => add(u));
  }

  return users;
};

const fetchUser = async (id, options = {}) => {
  const { storageStrategy = "" } = options;

  if (storageStrategy === "cache_api") {
    await cacheApi.storeResource(getUserCacheKey(id));
    const userResponse = await cacheApi.getTransaction(getUserCacheKey(id));

    if (userResponse) {
      // returning the user here in order to exit and not make the fetch request below
      return userResponse;
    }
  }

  const response = await fetch(getUserCacheKey(id));
  const user = await response.json();

  if (storageStrategy === "indexed_db") {
    const { add } = indexedDb.getTransaction("users");
    add(user);
  }

  return user;
};

const getCachedUser = async (id, options = {}) => {
  const { storageStrategy = "" } = options;
  let data = null;

  if (storageStrategy === "cache_api") {
    const response = await cacheApi.getSingleResource(
      id,
      getAllUsersCacheKey(),
      getUserCacheKey(id)
    );

    return response;
  }

  if (storageStrategy === "indexed_db") {
    data = indexedDb.getSingleCachedResourse("users", id);
  }

  return data;
};

const getCachedUsers = async (options = {}) => {
  const { storageStrategy = "" } = options;

  let results = [];

  if (storageStrategy === "cache_api") {
    results = await cacheApi.getTransaction(getAllUsersCacheKey());
  }

  if (storageStrategy === "indexed_db") {
    results = await indexedDb.getCachedArrayData("users");
  }

  return results;
};

const clearCachedUsers = (options = {}) => {
  const { storageStrategy = "" } = options;

  if (storageStrategy === "cache_api") {
    return cacheApi.clearCacheData("users");
  }

  if (storageStrategy === "indexed_db") {
    return indexedDb.clearCacheData("users");
  }

  return null;
};

export const userApi = (options = {}) => {
  return {
    fetchUsers: () => fetchUsers(options),
    fetchUser: (id) => fetchUser(id, options),
    getCachedUser: (id) => getCachedUser(id, options),
    getCachedUsers: () => getCachedUsers(options),
    clearCachedUsers: () => clearCachedUsers(options),
  };
};
