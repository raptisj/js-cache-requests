import { BASE_URL } from "../constants";
import {
  getTransaction as cacheApi_getTransaction,
  clearCacheData as cacheApi_clearCacheData,
  storeResource as cacheApi_storeResource,
} from "../libs/cache-api";
import {
  getCachedArrayData as idb_getCachedArrayData,
  getTransaction,
} from "../libs/indexed-db";

const getPostsCacheKey = () => `${BASE_URL}/posts`;
const getCommentsCacheKey = (id) => `${BASE_URL}/posts/${id}/comments`;

const fetchPosts = async () => {
  const response = await fetch(getPostsCacheKey());
  const posts = await response.json();

  return posts;
};

const fetchPostComments = async (id, options = {}) => {
  const { storageStrategy = "" } = options;

  if (storageStrategy === "cache_api") {
    await cacheApi_storeResource(getCommentsCacheKey(id));
    const response = await cacheApi_getTransaction(getCommentsCacheKey(id));

    return response;
  }

  const response = await fetch(getCommentsCacheKey(id));
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

  if (storageStrategy === "cache_api") {
    const response = await cacheApi_getTransaction(getCommentsCacheKey(postId));

    return response;
  }

  if (storageStrategy === "indexed_db") {
    data = idb_getCachedArrayData("comments", postId, "postId");
  }

  return data;
};

const clearCachedComments = (options = {}) => {
  const { storageStrategy = "" } = options;

  if (storageStrategy === "cache_api") {
    return cacheApi_clearCacheData("comments");
  }

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
