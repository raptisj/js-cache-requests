const STORAGE_STRATEGY = "local_storage";

export const initLocalStorage = (options = {}) => {
  const { stores } = options;

  stores.map(
    (s) =>
      !localStorage.getItem(s) && localStorage.setItem(s, JSON.stringify([])),
  );

  return STORAGE_STRATEGY;
};
