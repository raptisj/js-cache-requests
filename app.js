import "./style.css";
import { db } from "./config/initIndexedDB";
import { getTransaction } from "./utils/db";
import { fetchAndStoreUsers, fetchUser, getCachedUser } from "./api/users";
import { fetchPostComments, fetchPosts, getCachedComments } from "./api/posts";
import { renderComments, renderPosts, renderUser } from "./utils/dom";

const clearBtn = document.querySelector(".clear-btn");

clearBtn.addEventListener("click", () => {
  const transaction = db.transaction(["users", "comments"], "readwrite");

  transaction.oncomplete = () => {
    console.log("DB cleared");
  };

  const userObjectStore = transaction.objectStore("users");
  const commentsObjectStore = transaction.objectStore("comments");

  userObjectStore.clear();
  commentsObjectStore.clear();
});

const getPostWithComments = async (post) => {
  const cachedComments = await getCachedComments(post.id);

  if (!cachedComments.length) {
    const postComments = await fetchPostComments(post.id);
    const { add } = getTransaction("comments");

    postComments.map((c) => add(c));
    console.log(postComments, "postComments");
    renderComments(postComments);
  } else {
    renderComments(cachedComments);
  }
};

const getUserById = async (id) => {
  const cachedUser = getCachedUser(id);

  cachedUser.onsuccess = async (e) => {
    let user = e.target.result;

    if (!user) {
      user = await fetchUser(id);
      const { add } = getTransaction("users");
      add(user);
    }

    renderUser(user);
  };
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

  if (db) {
    const users = db?.transaction("users").objectStore("users").get(1);

    users.onsuccess = async (event) => {
      if (!event.target.result) {
        await fetchAndStoreUsers();
      }
    };
  } else {
    await fetchAndStoreUsers();
  }

  const posts = await fetchPosts();
  renderPosts({ results: posts, onClick: getPostDetails });
});
