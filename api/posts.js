import { BASE_URL } from "../constants";

export const fetchPosts = async () => {
  const postResponse = await fetch(`${BASE_URL}/posts/`);
  const postResults = await postResponse.json();

  return postResults;
};
