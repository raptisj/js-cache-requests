import { BASE_URL } from "../constants";

import { cacheApi } from "../libs/cache-api";
import { indexedDB } from "../libs/indexed-db";
import { localStorageDB } from "../libs/local-storage";

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
		await cacheApi.storeResource(getCommentsCacheKey(id));
		const response = await cacheApi.getTransaction(getCommentsCacheKey(id));

		return response;
	}

	const response = await fetch(getCommentsCacheKey(id));
	const comments = await response.json();

	if (storageStrategy === "indexed_db") {
		const { add } = indexedDB.getTransaction("comments");
		comments.map((c) => add(c));
	}

	if (storageStrategy === "local_storage") {
		localStorageDB.appendManyResources("comments", id, comments);
	}

	return comments;
};

const getCachedComments = async (postId, options = {}) => {
	const { storageStrategy = "" } = options;
	let data = null;

	if (storageStrategy === "cache_api") {
		const response = await cacheApi.getTransaction(getCommentsCacheKey(postId));

		return response;
	}

	if (storageStrategy === "indexed_db") {
		data = indexedDB.getCachedArrayData("comments", postId, "postId");
	}

	if (storageStrategy === "local_storage") {
		data = localStorageDB.getManyById("comments", postId);
	}

	return data;
};

const clearCachedComments = (options = {}) => {
	const { storageStrategy = "" } = options;

	if (storageStrategy === "cache_api") {
		return cacheApi.clearCacheData("comments");
	}

	if (storageStrategy === "indexed_db") {
		return indexedDB.clearCacheData("comments");
	}

	if (storageStrategy === "local_storage") {
		return localStorageDB.clearCacheData("comments");
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
