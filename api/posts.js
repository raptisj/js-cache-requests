import { BASE_URL } from "../constants";
import { getTransaction } from "../utils/db";

export const fetchPosts = async () => {
  const postResponse = await fetch(`${BASE_URL}/posts/`);
  const postResults = await postResponse.json();

  return postResults;
};

export const fetchPostComments = async (id) => {
  const postCommentsResponse = await fetch(`${BASE_URL}/posts/${id}/comments`);
  const postCommentsResults = await postCommentsResponse.json();

  return postCommentsResults;
};

export const getCachedComments = async (id) => {
  const { getIndex } = getTransaction("comments");

  const index = getIndex("postId");
  const request = index.openCursor(id);

  const comments = [];

  await new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        comments.push(cursor.value);
        cursor.continue();
      } else {
        resolve(comments);
      }
    };

    request.onerror = (error) => reject(error);
  });

  return comments;
};
