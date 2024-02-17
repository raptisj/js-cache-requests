import { postApi, userApi } from "./api";
import { initIndexedDB } from "./libs/indexed-db";
import "./style.css";
import { renderComments, renderPosts, renderUser } from "./utils/dom";
import { bytesToMegabytes, getStorageLimit } from "./utils/storage";

const storageStrategy = await initIndexedDB({
	connectionName: "js-cache-requests",
	version: 1,
	stores: [
		{
			name: "users",
			keyPath: "id",
		},
		{
			name: "comments",
			keyPath: "id",
			index: "postId",
		},
	],
});

const {
	fetchUsers,
	fetchUser,
	getCachedUser,
	getCachedUsers,
	clearCachedUsers,
} = userApi({
	storageStrategy,
});

const {
	fetchPosts,
	fetchPostComments,
	getCachedComments,
	clearCachedComments,
} = postApi({
	storageStrategy,
});

const clearButton = document.querySelector(".clear-btn");

clearButton.addEventListener("click", () => {
	clearCachedUsers();
	clearCachedComments();
});

const getPostWithComments = async (post) => {
	const cachedComments = await getCachedComments(post.id);

	let postComments = cachedComments;

	if (!postComments) {
		postComments = await fetchPostComments(post.id);
	}

	renderComments(postComments);
};

const getUserById = async (id) => {
	const cachedUser = await getCachedUser(id);

	let user = cachedUser;

	if (!user) {
		user = await fetchUser(id);
	}

	renderUser(user);
};

const getPostDetails = (r) => {
	getUserById(r.userId);
	getPostWithComments(r);
};

window.addEventListener("load", async () => {
	if (navigator?.storage) {
		const required = getStorageLimit(storageStrategy);
		const estimate = await navigator.storage.estimate();

		const available = bytesToMegabytes(estimate);

		if (available >= required) {
			console.log("Storage is available");
		}
	}

	const cachedUsers = await getCachedUsers();
	if (!cachedUsers.length) {
		await fetchUsers();
	}

	const posts = await fetchPosts();
	renderPosts({ results: posts, onClick: getPostDetails });
});
