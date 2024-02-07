const getStore = (store) => JSON.parse(localStorage.getItem(store));

const setStore = (store, value) =>
  localStorage.setItem(store, JSON.stringify(value));

const appendSingleResource = (store, value) => {
  const resource = getStore(store);

  if (!resource) return setStore(store, [value]);

  const existingResources = resource.filter((r) => r.id !== value.id);

  return setStore(store, [...existingResources, value]);
};

const appendManyResources = (store, id, values) => {
  const resources = getStore(store);

  if (!resources.length) return setStore(store, [...values]);

  const existingResources = resources.filter((r) => r.postId !== id);

  return setStore(store, [...existingResources, ...values]);
};

export const getManyById = (store, id) => {
  const resources = getStore(store);
  const result = resources?.filter((c) => c.postId === id);

  return result?.length ? result : null;
};

const getSingleResource = (store, id) => {
  const resource = getStore(store);

  const resourceExists = resource.find((r) => r.id === id);

  return resourceExists;
};

const clearCacheData = (store) => {
  localStorage.removeItem(store);
};

export const localStorageDB = {
  getStore,
  setStore,
  appendSingleResource,
  getSingleResource,
  appendManyResources,
  getManyById,
  clearCacheData,
};
