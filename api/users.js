import { BASE_URL } from "../constants";
import {
  getTransaction as cacheApi_getTransaction,
  storeResource as cacheApi_storeResource,
  getSingleResource as cacheApi_getSingleResource,
  clearCacheData as cacheApi_clearCacheData,
} from "../libs/cache-api";
import {
  getSingleCachedResourse as idb_getSingleCachedResourse,
  getTransaction as idb_getTransaction,
  getCachedData as idb_getCachedData,
  clearCacheData as idb_clearCacheData,
} from "../libs/indexed-db";

const getAllUsersCacheKey = () => `${BASE_URL}/users/`;
const getUserCacheKey = (id) => `${BASE_URL}/users/${id}`;

const fetchUsers = async (options = {}) => {
  const { storageStrategy = "" } = options;

  if (storageStrategy === "cache_api") {
    const response = await cacheApi_storeResource(getAllUsersCacheKey());

    return response;
  }

  const response = await fetch(getAllUsersCacheKey());
  const users = await response.json();

  if (storageStrategy === "indexed_db") {
    const { add } = idb_getTransaction("users");
    users.map((u) => add(u));
  }

  return users;
};

const fetchUser = async (id, options = {}) => {
  const { storageStrategy = "" } = options;

  if (storageStrategy === "cache_api") {
    await cacheApi_storeResource(getUserCacheKey(id));
    const userResponse = await cacheApi_getTransaction(getUserCacheKey(id));

    if (userResponse) {
      // returning the user here in order to exit and not make the fetch request below
      return userResponse;
    }
  }

  const response = await fetch(getUserCacheKey(id));
  const user = await response.json();

  if (storageStrategy === "indexed_db") {
    const { add } = idb_getTransaction("users");
    add(user);
  }

  return user;
};

const getCachedUser = async (id, options = {}) => {
  const { storageStrategy = "" } = options;
  let data = null;

  if (storageStrategy === "cache_api") {
    const response = await cacheApi_getSingleResource(
      id,
      getAllUsersCacheKey(),
      getUserCacheKey(id)
    );

    return response;
  }

  if (storageStrategy === "indexed_db") {
    data = idb_getSingleCachedResourse("users", id);
  }

  return data;
};

const getCachedUsers = async (options = {}) => {
  const { storageStrategy = "" } = options;

  let isEmpty = false;

  if (storageStrategy === "cache_api") {
    isEmpty = !!(await cacheApi_getTransaction(getAllUsersCacheKey()));
  }

  if (storageStrategy === "indexed_db") {
    isEmpty = await idb_getCachedData("users");
  }

  return isEmpty;
};

const clearCachedUsers = (options = {}) => {
  const { storageStrategy = "" } = options;

  if (storageStrategy === "cache_api") {
    return cacheApi_clearCacheData("users");
  }

  if (storageStrategy === "indexed_db") {
    return idb_clearCacheData("users");
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
