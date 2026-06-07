const storagePrefix = "LumousAI_";

const storage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(`${storagePrefix}accessToken`);
  },
  setAccessToken: (token: string) => {
    localStorage.setItem(`${storagePrefix}accessToken`, token);
  },
  removeAccessToken: () => {
    localStorage.removeItem(`${storagePrefix}accessToken`);
  },
  clear: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
  },
};

export default storage;
