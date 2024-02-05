import "./style.css";
import {
  fetchUser,
  getCachedUsers,
  getCachedUserById,
  fetchUsers,
} from "./api/users";
import {
  fetchPostComments,
  fetchPosts,
  getCachedCommentsPerPost,
} from "./api/posts";
import { renderComments, renderPosts, renderUser } from "./utils/dom";

const clearBtn = document.querySelector(".clear-btn");

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("users");
  localStorage.removeItem("comments");

  console.log("Local Storage is cleared");
});

const getPostWithComments = async (post) => {
  const cachedComments = getCachedCommentsPerPost(post.id);
  let postComments = cachedComments;

  if (!cachedComments) {
    postComments = await fetchPostComments(post.id, { localStorage: true });
  }

  renderComments(postComments);
};

const getUserById = async (id) => {
  const cachedUser = getCachedUserById(id);
  let user = cachedUser;

  if (!user) {
    user = await fetchUser(id, { localStorage: true });
  }

  renderUser(user);
};

const getPostDetails = (r) => {
  getUserById(r.userId);
  getPostWithComments(r);
};

window.addEventListener("load", async () => {
  if (navigator?.storage) {
    const required = 5; // around 5 MB is limit
    const estimate = await navigator.storage.estimate();

    // Divide the raw value by 1024 twice to convert it from bytes to megabytes.
    const available = Math.floor(
      (estimate.quota - estimate.usage) / 1024 / 1024
    );

    if (available >= required) {
      console.log("Storage is available");
    }
  }

  const cachedUsers = getCachedUsers();
  if (!cachedUsers) {
    await fetchUsers({ localStorage: true });
  }

  const posts = await fetchPosts();
  renderPosts({ results: posts, onClick: getPostDetails });
});
