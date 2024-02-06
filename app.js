import "./style.css";
import { userApi, postApi } from "./api";
import { renderComments, renderPosts, renderUser } from "./utils/dom";
import { bytesToMegabytes, getStorageLimit } from "./utils/storage";

const STORAGE_STRATEGY = "cache_api";
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
    const required = getStorageLimit(STORAGE_STRATEGY);
    const estimate = await navigator.storage.estimate();

    const available = bytesToMegabytes(estimate);

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
