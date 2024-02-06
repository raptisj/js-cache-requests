import { BASE_URL } from "../constants";
import {
  getCachedArrayData as idb_getCachedArrayData,
  getTransaction,
} from "../libs/indexed-db";

const fetchPosts = async () => {
  const response = await fetch(`${BASE_URL}/posts/`);
  const posts = await response.json();

  return posts;
};

const fetchPostComments = async (id, options = {}) => {
  const { storageStrategy = "" } = options;

  const response = await fetch(`${BASE_URL}/posts/${id}/comments`);
  const comments = await response.json();

  if (storageStrategy === "indexed_db") {
    const { add } = getTransaction("comments");
    comments.map((c) => add(c));
  }

  return comments;
};

const getCachedComments = async (postId, options = {}) => {
  const { storageStrategy = "" } = options;
  let data = null;

  if (storageStrategy === "indexed_db") {
    data = idb_getCachedArrayData("comments", postId, "postId");
  }

  return data;
};

const clearCachedComments = (options = {}) => {
  const { storageStrategy = "" } = options;

  if (storageStrategy === "indexed_db") {
    return idb_clearCacheData("comments");
  }

  return null;
};

export const postApi = (options = {}) => {
  return {
    fetchPosts,
    fetchPostComments: (id) => fetchPostComments(id, options),
    getCachedComments: (id) => getCachedComments(id, options),
    clearCachedComments: () => clearCachedComments(options),
  };
};
