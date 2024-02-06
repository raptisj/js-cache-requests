import "./style.css";
import { userApi, postApi } from "./api";
import { renderComments, renderPosts, renderUser } from "./utils/dom";

const STORAGE_STRATEGY = "indexed_db";
const {
  fetchUsers,
  fetchUser,
  getCachedUser,
  getCachedUsers,
  clearCachedUsers,
} = userApi({
  storageStrategy: STORAGE_STRATEGY,
});

const {
  fetchPosts,
  fetchPostComments,
  getCachedComments,
  clearCachedComments,
} = postApi({
  storageStrategy: STORAGE_STRATEGY,
});

const clearButton = document.querySelector(".clear-btn");

clearButton.addEventListener("click", () => {
  clearCachedUsers();
  clearCachedComments();
});

const getPostWithComments = async (post) => {
  const cachedComments = await getCachedComments(post.id);

  let postComments = cachedComments;

  if (!postComments || !postComments.length) {
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
    const required = 10; // 10 MB required
    const estimate = await navigator.storage.estimate();

    // Divide the raw value by 1024 twice to convert it from bytes to megabytes.
    const available = Math.floor(
      (estimate.quota - estimate.usage) / 1024 / 1024
    );

    if (available >= required) {
      console.log("Storage is available");
    }
  }

  const hasCachedUsers = await getCachedUsers();
  if (!hasCachedUsers) {
    await fetchUsers();
  }

  const posts = await fetchPosts();
  renderPosts({ results: posts, onClick: getPostDetails });
});
