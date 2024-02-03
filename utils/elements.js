export const createUser = (user, headerWording = "User details") => {
  const header = document.createElement("h2");
  const headerText = document.createTextNode(headerWording);
  header.appendChild(headerText);

  const element = document.createElement("div");
  const h2 = document.createElement("h3");
  const email = document.createElement("p");
  const phone = document.createElement("p");
  const website = document.createElement("p");

  const h2Text = document.createTextNode(user.name);
  const emailText = document.createTextNode(`Email: ${user.email}`);
  const phoneText = document.createTextNode(`Phone: ${user.phone}`);
  const websiteText = document.createTextNode(`Website: ${user.website}`);

  h2.appendChild(h2Text);
  email.appendChild(emailText);
  phone.appendChild(phoneText);
  website.appendChild(websiteText);

  element.appendChild(h2);
  element.appendChild(email);
  element.appendChild(phone);
  element.appendChild(website);

  return {
    header,
    element,
  };
};

export const createPostComments = (comments) => {
  const bodyWrapper = document.createElement("div");
  const header = document.createElement("h2");
  const headerText = document.createTextNode("Comments");
  header.appendChild(headerText);

  comments.map((comment) => {
    const element = document.createElement("div");
    const h2 = document.createElement("h3");
    const email = document.createElement("strong");
    const body = document.createElement("p");

    const h2Text = document.createTextNode(comment.name);
    const emailText = document.createTextNode(comment.email);
    const bodyText = document.createTextNode(comment.body);

    h2.appendChild(h2Text);
    email.appendChild(emailText);
    body.appendChild(bodyText);

    element.appendChild(h2);
    element.appendChild(email);
    element.appendChild(body);
    bodyWrapper.appendChild(element);
  });

  return {
    header,
    bodyWrapper,
  };
};
