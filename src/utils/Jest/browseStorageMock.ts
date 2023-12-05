const sessionStorageMock = (() => {
  let store = {};

  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

const makeSessionStorageMock = () => {
  return new Promise((resolve) => {
    resolve(
      Object.defineProperty(window, 'sessionStorage', {
        value: sessionStorageMock,
      }),
    );
  });
};

export { sessionStorageMock, makeSessionStorageMock };
