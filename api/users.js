import { BASE_URL } from "../constants";
import {
  getSingleCachedResourse as idb_getSingleCachedResourse,
  getTransaction as idb_getTransaction,
  getCachedData as idb_getCachedData,
  clearCacheData as idb_clearCacheData,
} from "../libs/indexed-db";

const fetchUsers = async (options = {}) => {
  const { storageStrategy = "" } = options;

  const response = await fetch(`${BASE_URL}/users/`);
  const users = await response.json();

  if (storageStrategy === "indexed_db") {
    const { add } = idb_getTransaction("users");
    users.map((u) => add(u));
  }

  return users;
};

const fetchUser = async (id, options = {}) => {
  const { storageStrategy = "" } = options;

  const response = await fetch(`${BASE_URL}/users/${id}`);
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

  if (storageStrategy === "indexed_db") {
    data = idb_getSingleCachedResourse("users", id);
  }

  return data;
};

const getCachedUsers = async (options = {}) => {
  const { storageStrategy = "" } = options;

  let isEmpty = false;

  if (storageStrategy === "indexed_db") {
    isEmpty = await idb_getCachedData("users");
  }

  return isEmpty;
};

const clearCachedUsers = (options = {}) => {
  const { storageStrategy = "" } = options;

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
