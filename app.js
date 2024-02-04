import "./style.css";
import { renderComments, renderPosts, renderUser } from "./utils/dom";
import { BASE_URL } from "./constants";
import { fetchPosts } from "./api/posts";

const getAllUsersCacheKey = () => `${BASE_URL}/users/`;
const getUserCacheKey = (id) => `${BASE_URL}/users/${id}`;
const getCommentsCacheKey = (id) => `${BASE_URL}/posts/${id}/comments`;

const clearBtn = document.querySelector(".clear-btn");

let cacheDB;
if ("caches" in window) {
  console.log("Cache API is supported");
  cacheDB = await caches.open("new-cache");
}

clearBtn.addEventListener("click", async () => {
  const cacheKeys = await cacheDB.keys();

  cacheKeys.forEach((req) => {
    cacheDB.delete(req.url);
  });

  console.log("Cache data deleted");
});

const getPostWithComments = async (post) => {
  const cachedPostCommentsResponse = await cacheDB.match(
    getCommentsCacheKey(post.id)
  );
  if (cachedPostCommentsResponse) {
    const postComments = await cachedPostCommentsResponse.json();

    return renderComments(postComments);
  }

  await cacheDB.add(getCommentsCacheKey(post.id));
  const postCommentsResponse = await cacheDB.match(
    getCommentsCacheKey(post.id)
  );

  if (postCommentsResponse) {
    const postComments = await postCommentsResponse.json();

    return renderComments(postComments);
  }
};

const getUserById = async (id) => {
  // first make a lookup in all users array
  const allUserResponse = await cacheDB.match(getAllUsersCacheKey());
  if (allUserResponse) {
    const cachedUser = await allUserResponse.json();
    const user = cachedUser.find((u) => u.id === id);

    return renderUser(user);
  }

  // if for some reason the array with all users is not defined, make a lookup to find one by id
  const singleUserResponse = await cacheDB.match(getUserCacheKey(id));
  if (singleUserResponse) {
    const user = await singleUserResponse.json();

    return renderUser(user);
  }

  // if none of the above applies then fetch a new one and add it to the cache
  await cacheDB.add(getUserCacheKey(id));
  const userResponse = await cacheDB.match(getUserCacheKey(id));
  if (userResponse) {
    const user = await userResponse.json();

    return renderUser(user);
  }
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

  const response = await cacheDB.match(getAllUsersCacheKey());
  if (!response) {
    cacheDB.add(getAllUsersCacheKey());
  }

  const posts = await fetchPosts();
  renderPosts({ results: posts, onClick: getPostDetails });
});
