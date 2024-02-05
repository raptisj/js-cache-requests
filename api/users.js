import { BASE_URL } from "../constants";
import { getStore, setStore } from "../utils/db";

export const fetchUsers = async (options = {}) => {
  const response = await fetch(`${BASE_URL}/users/`);
  const users = await response.json();

  if (options?.localStorage) {
    storeUsers(users);
  }

  return users;
};

export const fetchUser = async (id, options = {}) => {
  const response = await fetch(`${BASE_URL}/users/${id}`);
  const user = await response.json();

  if (options?.localStorage) {
    storeSingleUser(user);
  }

  return user;
};

export const getCachedUsers = () => getStore("users");
export const setCachedUsers = (value) => setStore("users", value);

export const storeUsers = (value) => setCachedUsers(value);

export const storeSingleUser = (value) => {
  const users = getCachedUsers();

  if (!users) return setCachedUsers([value]);

  const userExists = users.find((u) => u.id === value.id);
  if (!userExists) return setCachedUsers([...users, value]);
};

export const getCachedUserById = (id) => {
  const users = getCachedUsers();

  const user = users?.find((u) => u.id === id);

  return user;
};
