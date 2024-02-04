import { createPostComments, createUser } from "./elements";

const posts = document.querySelector(".posts");
const userDetails = document.querySelector(".user-details");
const comments = document.querySelector(".comments");

export const renderUser = (userResults) => {
  if (!userResults) {
    return (userDetails.innerHTML = "");
  }

  userDetails.innerHTML = "";

  const { header, element } = createUser(userResults);

  userDetails.appendChild(header);
  userDetails.appendChild(element);
};

export const renderPosts = ({ results, onClick }) => {
  results.map((r) => {
    const element = document.createElement("div");
    element.classList.add("post");

    const newContent = document.createTextNode(r.title);
    element.onclick = function () {
      onClick(r);
    };

    element.appendChild(newContent);
    posts.appendChild(element);
  });
};

export const renderComments = (postComments) => {
  if (!postComments.length) {
    return (comments.innerHTML = "");
  }

  comments.innerHTML = "";
  const { header, bodyWrapper } = createPostComments(postComments);

  comments.appendChild(header);
  comments.appendChild(bodyWrapper);
};
