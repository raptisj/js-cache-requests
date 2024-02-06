export let db;
let request;

if ("indexedDB" in window) {
  request = indexedDB.open("js-cache-requests", 1);
} else {
  db = null;
  request = null;

  console.log("Your browser does not support IndexedDB.");
}

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("users", { keyPath: "id" });
  const comments = db.createObjectStore("comments", { keyPath: "id" });
  // this postId index exists to retrieve all comments with a certain postId
  comments.createIndex("postId", "postId");
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("IndexedDB connection established!");
};

request.onerror = function (event) {
  console.log(event, "Something went wrong");
};
