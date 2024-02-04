import { BASE_URL } from "../constants";
import { getTransaction } from "../utils/db";

export const fetchUsers = async () => {
  const userResponse = await fetch(`${BASE_URL}/users/`);
  const userResults = await userResponse.json();

  return userResults;
};

export const fetchUser = async (id) => {
  const userResponse = await fetch(`${BASE_URL}/users/${id}`);
  const userResults = await userResponse.json();

  return userResults;
};

export const fetchAndStoreUsers = async () => {
  const userResults = await fetchUsers();
  const { add } = getTransaction("users");

  return userResults.map((u) => add(u));
};

export const getCachedUser = (id) => {
  const { get } = getTransaction("users");

  return get(id);
};
