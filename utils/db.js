export const getStore = (store) => JSON.parse(localStorage.getItem(store));
export const setStore = (store, value) =>
  localStorage.setItem(store, JSON.stringify(value));
