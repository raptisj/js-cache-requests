import "./style.css";
import { createPostComments, createUser } from "./utils/elements";

const posts = document.querySelector(".posts");
const userDetails = document.querySelector(".user-details");
const comments = document.querySelector(".comments");

const getPostWithComments = async (post) => {
  // TODO: cache post comments data
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${post.id}/comments?postId=${post.id}`
  );

  const postCommentResults = await res.json();

  getUserById(post.userId);

  if (!postCommentResults.length) {
    return (comments.innerHTML = "");
  }

  comments.innerHTML = "";
  const { header, bodyWrapper } = createPostComments(postCommentResults);

  comments.appendChild(header);
  comments.appendChild(bodyWrapper);
};

const getUserById = async (id) => {
  const userResponse = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  const userResults = await userResponse.json();

  if (!userResults) {
    return (userDetails.innerHTML = "");
  }

  userDetails.innerHTML = "";

  const { header, element } = createUser(userResults);

  userDetails.appendChild(header);
  userDetails.appendChild(element);
};

window.addEventListener("load", async () => {
  const postResponse = await fetch(
    "https://jsonplaceholder.typicode.com/todos/"
  );
  const postResults = await postResponse.json();

  const userResponse = await fetch(
    "https://jsonplaceholder.typicode.com/users/"
  );
  const userResults = await userResponse.json();
  // TODO: cache post data
  // TODO: cache user data

  postResults.map((r) => {
    const element = document.createElement("div");
    element.classList.add("post");

    const newContent = document.createTextNode(r.title);
    element.onclick = function () {
      getPostWithComments(r);
    };

    element.appendChild(newContent);
    posts.appendChild(element);
  });
});
