import { BASE_URL } from "../constants";
import { getStore, setStore } from "../utils/db";

export const fetchPosts = async () => {
  const postResponse = await fetch(`${BASE_URL}/posts/`);
  const postResults = await postResponse.json();

  return postResults;
};

export const fetchPostComments = async (postId, options = {}) => {
  const response = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  const comments = await response.json();

  if (options?.localStorage) {
    storeComments(postId, comments);
  }

  return comments;
};

export const getCachedComments = () => getStore("comments");
export const setCachedComments = (value) => setStore("comments", value);

export const storeComments = (postId, values) => {
  const comments = getCachedComments();

  if (!comments) return setCachedComments([...values]);

  const commentsExists = comments.find((c) => c.postId === postId);
  if (!commentsExists) return setCachedComments([...comments, ...values]);
};

export const getCachedCommentsPerPost = (postId) => {
  const comments = getCachedComments();
  const postComments = comments?.filter((c) => c.postId === postId);

  return postComments?.length ? postComments : null;
};
